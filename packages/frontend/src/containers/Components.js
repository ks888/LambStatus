import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchComponents, deleteComponent } from 'actions/components'
import Components from 'components/Components'

const mapStateToProps = (state) => {
  return {
    components: state.components.components
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents, deleteComponent}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Components)
