import React, { PropTypes } from 'react'

// MonitoringServiceSelector creates the selector associated with the service type.
// Each selector must handle the `props` object and the `onChange` function properly.
// The `props` object represents a set of values to identify the metric of the monitoring service.
// Its value may be null at first in the process of creating a new metric.
// The selector is expected to update the `props` object by showing the appropriate UI to a user.
// When the value should be changed, call `onChange` function.
export default class MonitoringServiceSelector extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    props: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  render () {
    const Selector = metricsSelectorManager.get(this.props.type)
    return (
      <Selector onChange={this.props.onChange} props={this.props.props} />
    )
  }
}

// MetricsSelectorManager manages registered selectors.
class MetricsSelectorManager {
  constructor () {
    this.services = {}
  }

  register (serviceName, selector) {
    this.services[serviceName] = selector
  }

  get (serviceName) {
    const selector = this.services[serviceName]
    if (selector === undefined) {
      throw new Error(`unknown service: ${serviceName}`)
    }

    return selector
  }

  listServices () {
    return Object.keys(this.services)
  }
}

// singleton
export const metricsSelectorManager = new MetricsSelectorManager()
