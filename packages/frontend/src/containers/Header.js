import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, signout } from 'actions/users'
import Header from 'components/Header'

const mapStateToProps = (state) => {
  return {
    username: state.user.user.username
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchUser, signout}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
