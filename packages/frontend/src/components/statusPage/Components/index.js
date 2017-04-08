import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchComponents } from 'actions/components'
import Components from './Components'

const mapStateToProps = (state) => {
  return {
    components: state.components.components
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchComponents}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Components)
