import React from 'react'

// MonitoringService is an interface the all monitoring service classes should implement.
export class MonitoringService {
  // getMetricsSelector returns a React component to select monitoring service's metrics.
  // The component must handle the `props` object and the `onChange` function properly.
  // The `props` object represents a set of values to identify the metric of the monitoring service.
  // Its value may be null at first in the process of creating a new metric.
  // The component is expected to update the `props` object by interacting with a user.
  // When the value is changed, call `onChange` function.
  getMetricsSelector () {
    throw new Error('not implemented')
  }

  // getServiceName returns the name of this monitoring service.
  getServiceName () {
    throw new Error('not implemented')
  }

  // getMessageInPreviewDialog returns a React component shown in the preview dialog.
  // Do not need to override this unless the monitoring service has the different data
  // collection mechanism.
  getMessageInPreviewDialog () {
    return (props) => {
      return (
        <div>
          Note: if the metric added just now, try again in 1 minute. Data will be backfilled up to 30 days in the past.
        </div>
      )
    }
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

  listServices () {
    return Object.keys(this.services)
  }
}

// singleton
export const monitoringServiceManager = new MonitoringServiceManager()
