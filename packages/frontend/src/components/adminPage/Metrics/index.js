import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMetrics, updateMetric, deleteMetric } from 'actions/metrics'
import Metrics from './Metrics'

const mapStateToProps = (state) => {
  return {
    metrics: state.metrics.metrics
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchMetrics, updateMetric, deleteMetric}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)
