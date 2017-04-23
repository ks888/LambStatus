import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMaintenances } from 'actions/maintenances'
import Maintenance from './Maintenance'

const mapStateToProps = (state, ownProps) => {
  let focusedMaintenance
  state.maintenances.maintenances.forEach((maintenance) => {
    if (maintenance.maintenanceID === ownProps.params.id) {
      focusedMaintenance = maintenance
    }
  })
  return {
    maintenanceID: ownProps.params.id,
    maintenance: focusedMaintenance
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchMaintenances}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Maintenance)
