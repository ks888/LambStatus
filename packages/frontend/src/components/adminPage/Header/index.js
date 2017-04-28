import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, signout } from 'actions/users'
import { fetchSettings } from 'actions/settings'
import Header from './Header'

const mapStateToProps = (state) => {
  return {
    username: state.user.user.username,
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchSettings, fetchUser, signout}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
