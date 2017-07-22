import React, { PropTypes } from 'react'
import { metricsSelectorManager } from 'components/adminPage/MonitoringServiceSelector'

export default class SelfMetricsSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    props: PropTypes.object
  }

  static get monitoringServiceName () {
    return 'Self'
  }

  render () {
    return null
  }
}

metricsSelectorManager.register(SelfMetricsSelector.monitoringServiceName, SelfMetricsSelector)
