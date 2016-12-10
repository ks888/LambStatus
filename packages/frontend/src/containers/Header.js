import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, signOut } from 'actions/users'
import Header from 'components/Header'

const mapStateToProps = (state) => {
  return {
    username: state.user.user.username
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchUser, signOut}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
