import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchPublicMetrics } from 'actions/metrics'
import Metrics from './Metrics'

const mapStateToProps = (state) => {
  return {
    metrics: state.metrics.metrics
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchPublicMetrics}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)
