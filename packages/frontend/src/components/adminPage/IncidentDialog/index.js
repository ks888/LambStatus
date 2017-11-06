import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncident, postIncident, updateIncident } from 'actions/incidents'
import { fetchComponents } from 'actions/components'
import IncidentDialog, { dialogType } from './IncidentDialog'

const mapStateToProps = (state, ownProps) => {
  let focusedIncident
  state.incidents.incidents.forEach((incident) => {
    if (incident.incidentID === ownProps.incidentID) {
      focusedIncident = incident
    }
  })
  return {
    components: state.components.components,
    incident: focusedIncident
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, fetchIncident, postIncident, updateIncident}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentDialog)
export const incidentDialogType = dialogType
