import { connect } from 'react-redux'
import Incidents from 'components/Incidents'

const mapStateToProps = (state) => {
  return {
    loadStatus: state.incidents.loadStatus,
    updateStatus: state.incidents.updateStatus,
    incidents: state.incidents.incidents,
    serviceComponents: state.incidents.components,
    message: state.incidents.message
  }
}

export default connect(mapStateToProps)(Incidents)
