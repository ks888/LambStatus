import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents, fetchIncidentUpdates } from 'actions/incidents'
import { fetchMaintenances, fetchMaintenanceUpdates } from 'actions/maintenances'
import Incidents from './Incidents'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents,
    maintenances: state.maintenances.maintenances
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents, fetchIncidentUpdates, fetchMaintenances, fetchMaintenanceUpdates},
                            dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Incidents)
