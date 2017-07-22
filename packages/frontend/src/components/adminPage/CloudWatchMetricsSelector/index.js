import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchExternalMetrics } from 'actions/metrics'
import { metricsSelectorManager } from 'components/adminPage/MonitoringServiceSelector'
import CloudWatchMetricsSelector from './CloudWatchMetricsSelector'

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
export default container

metricsSelectorManager.register(CloudWatchMetricsSelector.monitoringServiceName, container)
