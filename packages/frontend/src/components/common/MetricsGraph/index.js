import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMetricsData } from 'actions/metrics'
import MetricsGraph from './MetricsGraph'

const mapStateToProps = (state, ownProps) => {
  let focusedMetric
  state.metrics.metrics.forEach((metric) => {
    if (metric.metricID === ownProps.metricID) {
      focusedMetric = metric
    }
  })
  return {
    metric: focusedMetric
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchData: fetchMetricsData}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsGraph)
