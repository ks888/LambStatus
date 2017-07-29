import React, { PropTypes } from 'react'
import classes from './SelfMetricsSelector.scss'
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
    const linkToDoc = 'https://github.com/ks888/LambStatus/wiki/The-usage-of-%22Self%22-type-metrics'
    return (
      <div className={classes['container']}>
        <div>
          This option asks you to submit data points via LambStatus API. Check out
          <a href={linkToDoc} className={classes.link} target='_blank'>the Documentation</a>
          for more details.
        </div>
      </div>
    )
  }
}

metricsSelectorManager.register(SelfMetricsSelector.monitoringServiceName, SelfMetricsSelector)
