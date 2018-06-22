import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMaintenance, postMaintenance, updateMaintenance } from 'actions/maintenances'
import { fetchComponents } from 'actions/components'
import MaintenanceDialog, { dialogType } from './MaintenanceDialog'

const mapStateToProps = (state, ownProps) => {
  let focusedMaintenance
  state.maintenances.maintenances.forEach((maintenance) => {
    if (maintenance.maintenanceID === ownProps.maintenanceID) {
      focusedMaintenance = maintenance
    }
  })
  return {
    components: state.components.components,
    maintenance: focusedMaintenance
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, fetchMaintenance, postMaintenance, updateMaintenance}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceDialog)
export const maintenanceDialogType = dialogType
