import CloudWatch from 'aws/cloudWatch'
import S3 from 'aws/s3'
import MetricsStore from 'db/metrics'
import generateID from 'utils/generateID'
import { NotFoundError, ValidationError } from 'utils/errors'
import { metricStatuses, metricStatusVisible, monitoringServices, region } from 'utils/const'

export class Metric {
  constructor (metricID, type, title, unit, description, status, order, props) {
    if (!metricID) {
      this.metricID = generateID()
      this.needIDValidation = false
    } else {
      // If the user specifies the component ID, the ID must be already existed.
      this.metricID = metricID
      this.needIDValidation = true
    }
    this.type = type
    this.title = title
    this.unit = unit
    this.description = description
    this.status = status
    if (!order) {
      this.order = Math.floor(new Date().getTime() / 1000)
    } else {
      this.order = order
    }
    this.props = props
  }

  async validate () {
    if (this.metricID === undefined || this.metricID === '') {
      throw new ValidationError('invalid metricID parameter')
    }

    if (this.needIDValidation) {
      const metrics = new Metrics()
      await metrics.lookup(this.metricID)
    }

    if (monitoringServices.indexOf(this.type) < 0) {
      throw new ValidationError('invalid type parameter')
    }

    if (this.title === undefined || this.title === '') {
      throw new ValidationError('invalid title parameter')
    }

    if (this.unit === undefined) {
      throw new ValidationError('invalid unit parameter')
    }

    if (this.description === undefined) {
      throw new ValidationError('invalid description parameter')
    }

    if (metricStatuses.indexOf(this.status) < 0) {
      throw new ValidationError('invalid status parameter')
    }

    if (this.order === undefined || (typeof this.order !== 'number') || Math.floor(this.order) !== this.order) {
      throw new ValidationError('invalid order parameter')
    }

    if (this.props === undefined || this.props === null || typeof this.props !== 'object') {
      throw new ValidationError('invalid metrics parameter')
    }
  }

  async save () {
    const store = new MetricsStore()
    await store.update(this.metricID, this.type, this.title, this.unit, this.description, this.status,
                       this.order, this.props)
  }

  async delete () {
    const store = new MetricsStore()
    await store.delete(this.metricID)
  }

  objectify () {
    return {
      metricID: this.metricID,
      type: this.type,
      title: this.title,
      unit: this.unit,
      description: this.description,
      status: this.status,
      order: this.order,
      props: this.props
    }
  }
}

export class Metrics {
  async listExternal (type) {
    // TODO: should be instantiated based on 'type'
    return await new CloudWatch().listMetrics()
  }

  async listPublic () {
    const metrics = await this.list()
    return metrics.filter((metric) => {
      return metric.status === metricStatusVisible
    })
  }

  async list () {
    const metrics = await new MetricsStore().getAll()
    return metrics.map(metric => {
      return new Metric(metric.metricID, metric.type, metric.title, metric.unit, metric.description,
                        metric.status, metric.order, metric.props)
    })
  }

  async lookup (metricID) {
    const store = new MetricsStore()
    const metrics = await store.getByID(metricID)
    if (metrics.length === 0) {
      throw new NotFoundError('no matched item')
    } else if (metrics.length === 1) {
      const metric = metrics[0]
      return new Metric(metric.metricID, metric.type, metric.title, metric.unit, metric.description,
                        metric.status, metric.order, metric.props)
    } else {
      throw new Error('matched too many items')
    }
  }
}

class DataPoint {
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
    // TODO: should be instantiated based on 'type'
    this.service = new CloudWatch()
  }

  async getDataPoint (date) {
    const objectName = `metrics/${this.metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
    try {
      const s3 = new S3()
      const obj = await s3.getObject(region, this.dataBucket, objectName)
      return new DataPoint(objectName, JSON.parse(obj.Body.toString()))
    } catch (error) {
      // There will be no existing object at first.
      return null
    }
  }

  async putDataPoint (object) {
    const body = JSON.stringify(object.body)
    const s3 = new S3()
    return await s3.putObject(region, this.dataBucket, object.objectName, body)
  }

  async calculateUncollectedDates (curr) {
    const maxBackfillDates = 30
    for (let i = 0; i < maxBackfillDates; i++) {
      const data = await this.getDataPoint(curr)
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
    console.log(`collect the data for ${numUncollectedDates} dates (metricID: ${this.metricID})`)
    await Promise.all(Array.apply(null, {length: numUncollectedDates + 1}).map(async (value, i) => {
      const curr = new Date(now.getTime())
      curr.setDate(curr.getDate() - i)

      const existingData = await this.getDataPoint(curr)
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
        await this.save(curr, datapoints, existingData)
      }
    }))
  }

  async save (date, datapoints, existingDataPoint) {
    let dataObject
    if (existingDataPoint) {
      dataObject = existingDataPoint
    } else {
      const objectName = `metrics/${this.metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
      dataObject = new DataPoint(objectName, [])
    }
    dataObject.append(datapoints)
    return await this.putDataPoint(dataObject)
  }
}
