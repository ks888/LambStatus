import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchSettings } from 'actions/settings'
import { MonitoringService, monitoringServiceManager } from 'components/adminPage/MonitoringService'
import { apiURL } from 'utils/settings'
import classes from './Self.scss'
import Message from './Message'

const serviceName = 'Self'

class SelfMetricsSelector extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    props: PropTypes.object
  }

  render () {
    const linkToDoc = 'https://github.com/ks888/LambStatus/wiki/The-usage-of-%22Self%22-type-metrics'
    return (
      <div className={classes['container']}>
        <div>
          This option asks you to submit data points via LambStatus API. Check out
          <a href={linkToDoc} className={classes.link} target='_blank'>the documentation</a>
          for more details.
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
    apiHostname: apiURL
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchSettings}, dispatch)
}

const container = connect(mapStateToProps, mapDispatchToProps)(Message)

export default class Self extends MonitoringService {
  getMetricsSelector () {
    return SelfMetricsSelector
  }

  getServiceName () {
    return serviceName
  }

  getMessageInPreviewDialog () {
    return container
  }
}

monitoringServiceManager.register(serviceName, Self)
