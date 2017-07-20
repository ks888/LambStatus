// MonitoringService is an interface the all monitoring service classes should implement.
export class MonitoringService {
  // listMetrics returns a list of metrics.
  async listMetrics (nextToken = undefined, filters = {}) {
    throw new Error('not implemented')
  }

  // getMetricData returns the list of datapoints.
  async getMetricData (props, startTime, endTime) {
    throw new Error('not implemented')
  }
}

// MonitoringServiceManager is a manager class to create the new instance of some monitoring service.
class MonitoringServiceManager {
  constructor () {
    this.services = {}
  }

  register (serviceName, classObj) {
    this.services[serviceName] = classObj
  }

  create (serviceName) {
    const ClassObj = this.services[serviceName]
    if (ClassObj === undefined) {
      throw new Error(`unknown service: ${serviceName}`)
    }

    return new ClassObj()
  }
}

// singleton
export const monitoringServiceManager = new MonitoringServiceManager()
