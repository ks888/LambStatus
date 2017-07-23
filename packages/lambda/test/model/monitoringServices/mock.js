import { MonitoringService, monitoringServiceManager } from 'model/monitoringService'

export default class MockService extends MonitoringService {
  async listMetrics (nextToken = undefined, filters = {}) {
    return []
  }

  async getMetricData (props, startTime, endTime) {
    return []
  }

  shouldAdminPostDatapoints () {
    return true
  }
}

monitoringServiceManager.register('Mock', MockService)
// TODO: it's better to import thie module explicitly rather than corrupt the global namespace.
// For this, find out how to refer to this module in ES6 import style.
global.MockService = MockService
