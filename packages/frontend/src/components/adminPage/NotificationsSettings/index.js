import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateSettings } from 'actions/settings'
import NotificationsSettings from './NotificationsSettings'

const mapStateToProps = (state, ownProps) => {
  return {
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({updateSettings}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsSettings)
