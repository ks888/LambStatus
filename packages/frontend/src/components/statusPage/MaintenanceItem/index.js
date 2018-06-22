import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMaintenance } from 'actions/maintenances'
import MaintenanceItem from './MaintenanceItem'

const mapStateToProps = (state, ownProps) => {
  let focusedMaintenance
  state.maintenances.maintenances.forEach((maintenance) => {
    if (maintenance.maintenanceID === ownProps.maintenanceID) {
      focusedMaintenance = maintenance
    }
  })
  return {
    maintenance: focusedMaintenance
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchMaintenance}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MaintenanceItem)
