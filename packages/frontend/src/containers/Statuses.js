import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents, fetchIncidentUpdates } from 'actions/incidents'
import { fetchComponents } from 'actions/components'
import { fetchMetrics } from 'actions/metrics'
import Statuses from 'components/Statuses'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents,
    components: state.components.components,
    metrics: state.metrics.metrics
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents, fetchIncidentUpdates, fetchComponents, fetchMetrics},
                            dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Statuses)
