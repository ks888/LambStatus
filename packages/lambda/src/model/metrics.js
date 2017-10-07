import CloudFormation from 'aws/cloudFormation'
import S3 from 'aws/s3'
import MetricsStore from 'db/metrics'
import { monitoringServiceManager } from 'model/monitoringService'
import { ValidationError } from 'utils/errors'
import { metricStatuses, region, stackName } from 'utils/const'
import { getDateObject } from 'utils/datetime'

export class Metric {
  constructor ({metricID, type, title, status, unit = '', description = '', decimalPlaces = 0,
                order = Math.floor(new Date().getTime() / 1000), props = {}}) {
    this.metricID = metricID
    this.type = type
    this.monitoringService = monitoringServiceManager.create(this.type)
    this.title = title
    this.status = status
    this.unit = unit
    this.description = description
    this.decimalPlaces = decimalPlaces
    this.order = order
    this.props = props
  }

  validate () {
    if (this.metricID === undefined || this.metricID === '') {
      throw new ValidationError('invalid metricID parameter')
    }
    this.validateExceptID()
  }

  validateExceptID () {
    if (this.title === undefined || this.title === '') {
      throw new ValidationError('invalid title parameter')
    }

    if (this.unit === undefined) {
      throw new ValidationError('invalid unit parameter')
    }

    if (this.description === undefined) {
      throw new ValidationError('invalid description parameter')
    }

    if (this.decimalPlaces === undefined || this.decimalPlaces !== parseInt(this.decimalPlaces, 10)) {
      throw new ValidationError('invalid decimalPlaces parameter')
    }

    if (metricStatuses.indexOf(this.status) < 0) {
      throw new ValidationError('invalid status parameter')
    }

    if (this.order === undefined || (typeof this.order !== 'number') || Math.floor(this.order) !== this.order) {
      throw new ValidationError('invalid order parameter')
    }

    if (this.props === undefined) {
      throw new ValidationError('invalid metrics parameter')
    }
  }

  setMetricID (metricID) {
    this.metricID = metricID
  }

  async getBucketName () {
    if (this.bucketName !== undefined) {
      return this.bucketName
    }
    this.bucketName = await new CloudFormation(stackName).getStatusPageBucketName()
    return this.bucketName
  }

  buildObjectName (metricID, date) {
    return `metrics/${metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
  }

  async getDatapoints (date) {
    const objectName = this.buildObjectName(this.metricID, date)
    const bucketName = await this.getBucketName()
    try {
      const s3 = new S3()
      const obj = await s3.getObject(region, bucketName, objectName)
      return JSON.parse(obj.Body.toString())
    } catch (error) {
      // There will be no existing object at first.
      return null
    }
  }

  normalizeDatapoints (datapoints) {
    datapoints.forEach(datapoint => {
      datapoint.timestamp = datapoint.timestamp.substr(0, 16) + ':00.000Z'
    })
    datapoints = datapoints.filter((datapoint, i, arr) => {
      if (i === 0) return true
      return arr[i - 1].timestamp !== arr[i].timestamp
    })
    datapoints.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return 1
      } else if (a.timestamp < b.timestamp) {
        return -1
      } else {
        return 0
      }
    })
    return datapoints
  }

  async insertNormalizedDatapointsAtDate (datapoints, date) {
    const objectName = this.buildObjectName(this.metricID, date)
    const bucketName = await this.getBucketName()
    let existingDatapoints = await this.getDatapoints(date)
    if (existingDatapoints === null) {
      existingDatapoints = []
    }

    let mergedDatapoints = []
    let insertedDatapoints = []
    let i = 0
    let j = 0
    while (i < existingDatapoints.length && j < datapoints.length) {
      const existingPoint = existingDatapoints[i]
      const newPoint = datapoints[j]
      if (existingPoint.timestamp < newPoint.timestamp) {
        mergedDatapoints.push(existingPoint)
        i++
      } else if (existingPoint.timestamp === newPoint.timestamp) {
        mergedDatapoints.push(newPoint)
        insertedDatapoints.push(newPoint)
        i++
        j++
      } else {
        mergedDatapoints.push(newPoint)
        insertedDatapoints.push(newPoint)
        j++
      }
    }

    if (i < existingDatapoints.length) {
      mergedDatapoints = mergedDatapoints.concat(existingDatapoints.slice(i))
    } else if (j < datapoints.length) {
      const rest = datapoints.slice(j)
      mergedDatapoints = mergedDatapoints.concat(rest)
      insertedDatapoints = insertedDatapoints.concat(rest)
    }

    const s3 = new S3()
    await s3.putObject(region, bucketName, objectName, JSON.stringify(mergedDatapoints))
    return insertedDatapoints
  }

  async insertDatapointsWithLock (datapoints) {
    const store = new MetricsStore()
    await store.lock(this.metricID)
    try {
      await this.insertDatapoints(datapoints)
    } finally {
      try {
        await store.unlock(this.metricID)
      } catch (err) {
        console.error(`failed to unlock mutex (metricID: ${this.metricID})`, err.toString())
      }
    }
  }

  async insertDatapoints (datapoints) {
    datapoints = this.normalizeDatapoints(datapoints)

    const dates = {}
    datapoints.forEach(datapoint => {
      const date = datapoint.timestamp.substr(0, 10)
      if (date in dates) {
        dates[date].push(datapoint)
      } else {
        dates[date] = [datapoint]
      }
    })
    let insertedDatapoints = []
    await Promise.all(Object.keys(dates).map(async date => {
      const data = dates[date]
      const result = await this.insertNormalizedDatapointsAtDate(data, getDateObject(data[0].timestamp))
      insertedDatapoints = insertedDatapoints.concat(result)
    }))
    return insertedDatapoints
  }

  async calculateUncollectedDates (curr) {
    const maxBackfillDates = 30
    for (let i = 0; i < maxBackfillDates; i++) {
      const data = await this.getDatapoints(curr)
      if (data) {
        return i
      }
      curr.setDate(curr.getDate() - 1)
    }
    return maxBackfillDates
  }

  async collect () {
    const now = new Date()
    const numUncollectedDates = await this.calculateUncollectedDates(new Date(now.getTime()))
    console.log(`collect the data for ${numUncollectedDates + 1} dates (metricID: ${this.metricID})`)

    await Promise.all(Array.apply(null, {length: numUncollectedDates + 1}).map(async (value, i) => {
      const curr = new Date(now.getTime())
      curr.setDate(curr.getDate() - i)

      const existingDatapoints = await this.getDatapoints(curr)
      let begin, lastTimestamp
      if (existingDatapoints && existingDatapoints.length > 0) {
        lastTimestamp = existingDatapoints[existingDatapoints.length - 1].timestamp
        begin = getDateObject(lastTimestamp)
      } else {
        begin = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate())
      }

      const end = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate())
      end.setDate(end.getDate() + 1)

      let datapoints = await this.monitoringService.getMetricData(this.metricID, this.props, begin, end)
      if (datapoints.length > 0 && lastTimestamp && datapoints[0].timestamp === lastTimestamp) {
        datapoints = datapoints.slice(1)
      }
      console.log(`collected ${datapoints.length} datapoints (metricID: ${this.metricID}, i: ${i})`)

      if (datapoints.length > 0 || !existingDatapoints) {
        datapoints = (existingDatapoints === null ? [] : existingDatapoints).concat(datapoints)
        datapoints = this.normalizeDatapoints(datapoints)
        await this.insertNormalizedDatapointsAtDate(datapoints, begin)
      }
    }))
  }

  objectify () {
    return {
      metricID: this.metricID,
      type: this.type,
      title: this.title,
      unit: this.unit,
      description: this.description,
      decimalPlaces: this.decimalPlaces,
      status: this.status,
      order: this.order,
      props: this.props
    }
  }
}

export class Metrics {
  async listExternal (type, cursor, filters) {
    const monitoringService = monitoringServiceManager.create(type)
    return await monitoringService.listMetrics(cursor, filters)
  }
}
