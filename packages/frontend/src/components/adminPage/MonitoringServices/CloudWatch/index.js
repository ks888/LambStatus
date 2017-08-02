import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchExternalMetrics } from 'actions/metrics'
import { MonitoringService, monitoringServiceManager } from 'components/adminPage/MonitoringService'
import CloudWatchMetricsSelector from './CloudWatchMetricsSelector'

const serviceName = 'CloudWatch'

const mapStateToProps = (state) => {
  let filters, metrics
  if (state.metrics.externalMetrics.CloudWatch) {
    filters = state.metrics.externalMetrics.CloudWatch.filters
    metrics = state.metrics.externalMetrics.CloudWatch.metrics
  }
  return { metrics, filters }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchExternalMetrics}, dispatch)
}

const container = connect(mapStateToProps, mapDispatchToProps)(CloudWatchMetricsSelector)

export default class CloudWatch extends MonitoringService {
  getMetricsSelector () {
    return container
  }

  getServiceName () {
    return serviceName
  }
}

monitoringServiceManager.register(serviceName, CloudWatch)
