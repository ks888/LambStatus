import { connect } from 'react-redux'
import MetricPreviewDialog from './MetricPreviewDialog'

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

export default connect(mapStateToProps)(MetricPreviewDialog)
