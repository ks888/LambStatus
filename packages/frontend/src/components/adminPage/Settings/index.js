import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchSettings } from 'actions/settings'
import Settings from './Settings'

const mapStateToProps = (state) => {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchSettings}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
