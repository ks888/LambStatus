import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchComponents } from 'actions/components'
import { fetchPublicMetrics } from 'actions/metrics'
import Statuses from './Statuses'

const mapStateToProps = (state) => {
  return {
    components: state.components.components,
    metrics: state.metrics.metrics,
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, fetchPublicMetrics}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Statuses)
