import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateMaintenanceUpdate } from 'actions/maintenances'
import MaintenanceUpdateItem from './MaintenanceUpdateItem'

const mapStateToProps = (state, ownProps) => {
  let focusedMaintenance
  state.maintenances.maintenances.forEach((maintenance) => {
    if (maintenance.maintenanceID === ownProps.maintenanceID) {
      focusedMaintenance = maintenance
    }
  })
  let focusedMaintenanceUpdate
  focusedMaintenance.maintenanceUpdates.forEach(update => {
    if (update.maintenanceUpdateID === ownProps.maintenanceUpdateID) {
      focusedMaintenanceUpdate = update
    }
  })
  return {
    maintenanceUpdate: focusedMaintenanceUpdate
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({updateMaintenanceUpdate}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceUpdateItem)
