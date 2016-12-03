import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchIncidentsWithUpdates } from 'actions/incidents'
import { fetchComponents } from 'actions/components'
import Statuses from 'components/Statuses'

const mapStateToProps = (state) => {
  return {
    incidents: state.incidents.incidents,
    components: state.components.components
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchIncidentsWithUpdates, fetchComponents}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Statuses)
