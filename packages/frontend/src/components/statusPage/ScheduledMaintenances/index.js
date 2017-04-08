import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMaintenances, fetchMaintenanceUpdates } from 'actions/maintenances'
import ScheduledMaintenances from './ScheduledMaintenances'

const mapStateToProps = (state) => {
  return {
    maintenances: state.maintenances.maintenances
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchMaintenances, fetchMaintenanceUpdates}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMaintenances)
