import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser } from 'actions/users'
import Header from 'components/Header'

const mapStateToProps = (state) => {
  return {
    username: state.user.user.username
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchUser}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
