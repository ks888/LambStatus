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
    metric: focusedMetric,
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const fetchData = fetchMetricsData.bind(null, ownProps.settings.StatusPageURL)
  return bindActionCreators({fetchData}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricsGraph)
