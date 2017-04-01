import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMaintenances, deleteMaintenance } from 'actions/maintenances'
import Maintenances from './Maintenances'

const mapStateToProps = (state) => {
  return {
    maintenances: state.maintenances.maintenances
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchMaintenances, deleteMaintenance}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Maintenances)
