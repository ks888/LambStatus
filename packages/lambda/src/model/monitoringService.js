// MonitoringService is an interface the all monitoring service classes should implement.
export class MonitoringService {
  // listMetrics returns a list of metrics.
  async listMetrics (nextToken = undefined, filters = {}) {
    throw new Error('not implemented')
  }

  // getMetricData returns the list of datapoints.
  // `metricID` is the ID of the metric added to LambStatus (not the metric ID of the monitoring service).
  // `props` is the object to select the specific metric. Its values depend on
  // the actual monitoring service.
  // `startTime` is the time stamp that determines the first data point to return.
  // The value specified is inclusive.
  // `endTime` is he time stamp that determines the last data point to return.
  // The value specified is exclusive.
  async getMetricData (metricID, props, startTime, endTime) {
    throw new Error('not implemented')
  }

  // allowPostDatapointsAPI returns true if a user can post new datapoints to a LambStatus metric
  // via LambStatus API. Not allowed by default.
  allowPostDatapointsAPI () {
    return false
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
