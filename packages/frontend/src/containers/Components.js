import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchComponents, postComponent, updateComponent, deleteComponent } from 'actions/components'
import Components from 'components/Components'

const mapStateToProps = (state) => {
  return {
    loadStatus: state.components.loadStatus,
    updateStatus: state.components.updateStatus,
    serviceComponents: state.components.serviceComponents,
    message: state.components.message
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, postComponent, updateComponent, deleteComponent}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Components)
