import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidents, fetchIncidentUpdates } from 'actions/incidents'
import History from './History'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidents, fetchIncidentUpdates}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
