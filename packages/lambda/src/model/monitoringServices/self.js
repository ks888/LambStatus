import { Metrics } from 'model/metrics'
import { MonitoringService, monitoringServiceManager } from 'model/monitoringService'

const serviceName = 'Self'

export default class Self extends MonitoringService {
  async listMetrics (nextToken = undefined, filters = {}) {
    const metrics = await new Metrics().list()
    return metrics.filter(metric => metric.type === serviceName).map(metric => metric.objectify())
  }

  async getMetricData (metricID, props, startTime, endTime) {
    const metric = await new Metrics().lookup(metricID)

    const startTimeStr = startTime.toISOString()
    const endTimeStr = endTime.toISOString()
    if (startTimeStr > endTimeStr) {
      throw new Error('startTime is later than endTime')
    }

    const endYMD = `${endTime.getFullYear()}/${endTime.getMonth() + 1}/${endTime.getDate()}`
    let datapoints = []
    const curr = new Date(startTime.getTime())
    while (true) {
      const newDatapoints = await metric.getDatapoints(curr)
      if (newDatapoints !== null) {
        datapoints = datapoints.concat(newDatapoints)
      }

      const currYMD = `${curr.getFullYear()}/${curr.getMonth() + 1}/${curr.getDate()}`
      if (currYMD === endYMD) {
        break
      }
      curr.setDate(curr.getDate() + 1)
    }

    return datapoints.filter(dataPoint => {
      return startTimeStr <= dataPoint.timestamp && dataPoint.timestamp < endTimeStr
    })
  }

  shouldAdminPostDatapoints () {
    return true
  }
}

monitoringServiceManager.register(serviceName, Self)
