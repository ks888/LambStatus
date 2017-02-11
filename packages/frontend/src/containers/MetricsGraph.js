import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMetricsData } from 'actions/metrics'
import MetricsGraph from 'components/MetricsGraph'

const mapStateToProps = (state) => {
  return {
    metrics: state.metrics
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchData: fetchMetricsData}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsGraph)
