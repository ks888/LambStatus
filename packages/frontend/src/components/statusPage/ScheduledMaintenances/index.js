import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchMaintenances } from 'actions/maintenances'
import ScheduledMaintenances from './ScheduledMaintenances'

const mapStateToProps = (state) => {
  return {
    maintenances: state.maintenances.maintenances
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchMaintenances}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMaintenances)
