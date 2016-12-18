import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents, deleteIncident } from 'actions/incidents'
import Incidents from 'components/Incidents'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents, deleteIncident}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Incidents)
