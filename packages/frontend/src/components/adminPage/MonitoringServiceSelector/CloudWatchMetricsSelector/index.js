import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchExternalMetrics } from 'actions/metrics'
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

export default connect(mapStateToProps, mapDispatchToProps)(CloudWatchMetricsSelector)
