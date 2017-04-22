import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents } from 'actions/incidents'
import Incident from './Incident'

const mapStateToProps = (state, ownProps) => {
  let focusedIncident
  state.incidents.incidents.forEach((incident) => {
    if (incident.incidentID === ownProps.params.id) {
      focusedIncident = incident
    }
  })
  return {
    incidentID: ownProps.params.id,
    incident: focusedIncident
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Incident)
