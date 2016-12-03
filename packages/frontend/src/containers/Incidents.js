import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents, fetchIncidentUpdates, postIncident, updateIncident, deleteIncident } from 'actions/incidents'
import { fetchComponents } from 'actions/components'
import Incidents from 'components/Incidents'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents,
    components: state.components.components
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents, fetchComponents, fetchIncidentUpdates,
    postIncident, updateIncident, deleteIncident}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Incidents)
