import CloudWatchService from 'aws/cloudWatch'
import MetricsDB from 'db/metrics'
import generateID from 'utils/generateID'
import { ParameterError } from 'utils/errors'
import { metricStatuses, metricStatusVisible, monitoringServices, region } from 'utils/const'
import S3 from 'aws/s3'

export class Metrics {
  constructor () {
    this.metricsDB = new MetricsDB()
  }

  async listExternalMetrics (type) {
    // should be instantiated based on 'type'
    return await new CloudWatchService().listMetrics()
  }

  async listPublicMetrics () {
    const metrics = await this.metricsDB.listMetrics()
    return metrics.filter((element) => {
      return element.status === metricStatusVisible
    })
  }

  async listMetrics () {
    return await this.metricsDB.listMetrics()
  }

  validate (metricID, type, title, unit, description, status, props) {
    if (metricID === undefined || metricID === '') {
      throw new ParameterError('invalid metricID parameter')
    }

    if (monitoringServices.indexOf(type) < 0) {
      throw new ParameterError('invalid type parameter')
    }

    if (title === undefined || title === '') {
      throw new ParameterError('invalid title parameter')
    }

    if (unit === undefined) {
      throw new ParameterError('invalid unit parameter')
    }

    if (description === undefined) {
      throw new ParameterError('invalid description parameter')
    }

    if (metricStatuses.indexOf(status) < 0) {
      throw new ParameterError('invalid status parameter')
    }

    if (props === undefined || props === null || typeof props !== 'object') {
      throw new ParameterError('invalid metrics parameter')
    }
  }

  async createMetric (type, title, unit, description, status, props) {
    const metricID = generateID()
    this.validate(metricID, type, title, unit, description, status, props)
    return await this.metricsDB.postMetric(metricID, type, title, unit, description, status, props)
  }

  async updateMetric (metricID, type, title, unit, description, status, props) {
    this.validate(metricID, type, title, unit, description, status, props)
    await this.metricsDB.getMetric(metricID)  // existence check

    return await this.metricsDB.postMetric(metricID, type, title, unit, description, status, props)
  }

  async deleteMetric (metricID) {
    if (metricID === undefined || metricID === '') {
      throw new ParameterError('invalid metricID parameter')
    }
    await this.metricsDB.getMetric(metricID)  // existence check

    await this.metricsDB.deleteMetric(metricID)
  }
}

class DataObject {
  constructor (objectName, body) {
    this.objectName = objectName
    this.body = body
  }

  append (newData) {
    this.body = this.body.concat(newData)
  }
}

export class MetricsData {
  constructor (metricID, type, props, dataBucket) {
    this.metricID = metricID
    this.type = type
    this.props = props
    this.dataBucket = dataBucket
    // should be instantiated based on 'type'
    this.service = new CloudWatchService()
  }

  async getDataObject (date) {
    const objectName = `metrics/${this.metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
    try {
      const s3 = new S3()
      const obj = await s3.getObject(region, this.dataBucket, objectName)
      return new DataObject(objectName, JSON.parse(obj.Body.toString()))
    } catch (error) {
      // There will be no existing object at first.
      return null
    }
  }

  async putDataObject (object) {
    const body = JSON.stringify(object.body)
    const s3 = new S3()
    return await s3.putObject(region, this.dataBucket, object.objectName, body)
  }

  async calculateUncollectedDates (curr) {
    const maxBackfillDates = 30
    for (let i = 0; i < maxBackfillDates; i++) {
      const data = await this.getDataObject(curr)
      if (data) {
        return i
      }
      curr.setDate(curr.getDate() - 1)
    }
    return maxBackfillDates
  }

  async collectData () {
    const now = new Date()
    const numUncollectedDates = await this.calculateUncollectedDates(new Date(now.getTime()))
    console.log(`collect the data for ${numUncollectedDates} dates (metricID: ${this.metricID})`)
    await Promise.all(Array.apply(null, {length: numUncollectedDates + 1}).map(async (value, i) => {
      const curr = new Date(now.getTime())
      curr.setDate(curr.getDate() - i)

      const existingData = await this.getDataObject(curr)
      let begin, lastTimestamp
      if (existingData && existingData.body.length > 0) {
        begin = existingData.body[existingData.body.length - 1].timestamp
        lastTimestamp = begin
      } else {
        begin = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate())
      }

      const end = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate())
      end.setDate(end.getDate() + 1)

      let datapoints = await this.service.getMetricData(this.props, begin, end)
      if (datapoints.length > 0 && lastTimestamp && datapoints[0].timestamp === lastTimestamp) {
        datapoints = datapoints.slice(1)
      }
      console.log(`collected ${datapoints.length} datapoints (metricID: ${this.metricID}, i: ${i})`)

      if (datapoints.length > 0 || !existingData) {
        await this.saveData(curr, datapoints, existingData)
      }
    }))
  }

  async saveData (date, datapoints, existingDataObject) {
    let dataObject
    if (existingDataObject) {
      dataObject = existingDataObject
    } else {
      const objectName = `metrics/${this.metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
      dataObject = new DataObject(objectName, [])
    }
    dataObject.append(datapoints)
    return await this.putDataObject(dataObject)
  }
}
