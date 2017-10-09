import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateIncidentUpdate } from 'actions/incidents'
import IncidentUpdateItem from './IncidentUpdateItem'

const mapStateToProps = (state, ownProps) => {
  let focusedIncident
  state.incidents.incidents.forEach((incident) => {
    if (incident.incidentID === ownProps.incidentID) {
      focusedIncident = incident
    }
  })
  let focusedIncidentUpdate
  focusedIncident.incidentUpdates.forEach(update => {
    if (update.incidentUpdateID === ownProps.incidentUpdateID) {
      focusedIncidentUpdate = update
    }
  })
  return {
    incidentUpdate: focusedIncidentUpdate
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({updateIncidentUpdate}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentUpdateItem)
