import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Statuses from './Statuses'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Statuses)
