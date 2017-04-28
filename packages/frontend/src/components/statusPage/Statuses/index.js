import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchComponents } from 'actions/components'
import { fetchPublicMetrics } from 'actions/metrics'
import { fetchPublicSettings } from 'actions/settings'
import Statuses from './Statuses'

const mapStateToProps = (state) => {
  return {
    components: state.components.components,
    metrics: state.metrics.metrics,
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, fetchPublicMetrics, fetchPublicSettings}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Statuses)
