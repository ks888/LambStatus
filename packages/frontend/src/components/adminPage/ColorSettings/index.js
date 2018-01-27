import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateSettings } from 'actions/settings'
import ColorSettings from './ColorSettings'

const mapStateToProps = (state) => {
  return {
    backgroundColor: state.settings.settings.backgroundColor
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({updateSettings}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorSettings)
