import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { postMetric, updateMetric } from 'actions/metrics'
import MetricDialog from 'components/MetricDialog'

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
  return bindActionCreators({postMetric, updateMetric}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MetricDialog)
