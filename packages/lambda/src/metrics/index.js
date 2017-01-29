import { getObject, putObject } from 'utils/s3'
import { getMetricData } from 'utils/cloudWatch'
import { region } from 'utils/const'

class DataObject {
  constructor (objectName, body) {
    this.objectName = objectName
    this.body = body
  }

  getLastTimestamp () {
    if (this.body.length > 0) {
      return this.body[this.body.length - 1].timestamp
    }
    return null
  }

  append (newData) {
    this.body = this.body.concat(newData)
  }
}

export default class MetricsData {
  constructor (metricID, type, props, dataBucket) {
    this.metricID = metricID
    this.type = type
    this.props = props
    this.dataBucket = dataBucket
  }

  async getDataObject (date) {
    const objectName = `metrics/${this.metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
    try {
      const obj = await getObject(region, this.dataBucket, objectName)
      return new DataObject(objectName, JSON.parse(obj.Body.toString()))
    } catch (error) {
      // There will be no existing object at first.
      return null
    }
  }

  async putDataObject (object) {
    const body = JSON.stringify(object.body)
    return await putObject(region, this.dataBucket, object.objectName, body)
  }

  async collectData () {
    const currDate = new Date()
    const currDateData = await this.getDataObject(currDate)

    const prevDate = new Date(currDate.getTime())
    prevDate.setDate(prevDate.getDate() - 1)
    let prevDateData = null
    let lastTimestamp
    if (currDateData && currDateData.getLastTimestamp() !== null) {
      lastTimestamp = currDateData.getLastTimestamp()
    } else {
      // try the prev date
      prevDateData = await this.getDataObject(prevDate)
      if (prevDateData && prevDateData.getLastTimestamp() !== null) {
        lastTimestamp = prevDateData.getLastTimestamp()
      } else {
        // it's like a first attempt to collect data.
        lastTimestamp = prevDate.toISOString()
      }
    }

    let datapoints = await getMetricData(this.props, lastTimestamp, currDate)
    if (datapoints.length > 0 && datapoints[0].timestamp === lastTimestamp) {
      datapoints = datapoints.slice(1)
    }
    const currDateStr = currDate.toISOString().slice(0, 10)
    let splitIndex = datapoints.length
    for (let i = 0; i < datapoints.length; i++) {
      if (datapoints[i].timestamp.startsWith(currDateStr)) {
        splitIndex = i
        break
      }
    }

    const currDateDatapoints = datapoints.slice(splitIndex)
    if (currDateDatapoints.length !== 0) {
      await this.saveData(currDate, currDateDatapoints, currDateData)
    }

    const prevDateDatapoints = datapoints.slice(0, splitIndex)
    if (prevDateDatapoints.length !== 0) {
      await this.saveData(prevDate, prevDateDatapoints, prevDateData)
    }
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
