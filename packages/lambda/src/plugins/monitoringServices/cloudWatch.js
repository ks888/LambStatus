import CloudWatchAPI from 'aws/cloudWatch'
import { MonitoringService, monitoringServiceManager } from 'model/monitoringService'

export default class CloudWatch extends MonitoringService {
  constructor () {
    super()
    this.api = new CloudWatchAPI()
  }

  async listMetrics (nextToken = undefined, filters = {}) {
    return await this.api.listMetrics(nextToken, filters)
  }

  async getMetricData (metricID, props, startTime, endTime) {
    return await this.api.getMetricData(props, startTime, endTime)
  }
}

monitoringServiceManager.register('CloudWatch', CloudWatch)
