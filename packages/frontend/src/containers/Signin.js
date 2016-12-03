import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { signin } from 'actions/users'
import Signin from 'components/Signin'

const mapStateToProps = (state) => {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({signin}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin)
