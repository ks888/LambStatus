import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signin, forgotPassword, setCodeAndPassword } from 'actions/users'
import Signin from './Signin'

const mapStateToProps = (state) => {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({signin, forgotPassword, setCodeAndPassword}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
