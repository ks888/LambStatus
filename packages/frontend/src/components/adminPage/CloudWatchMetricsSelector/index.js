import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchExternalMetrics } from 'actions/metrics'
import CloudWatchMetricsSelector from './CloudWatchMetricsSelector'

const mapStateToProps = (state) => {
  return {
    metrics: state.metrics.externalMetrics.CloudWatch
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchExternalMetrics}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CloudWatchMetricsSelector)
