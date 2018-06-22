import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { subscribe } from 'actions/settings'
import SubscriptionMenu from './SubscriptionMenu'

const mapStateToProps = (state) => {
  return {
    emailEnabled: state.settings.settings.emailEnabled
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({subscribe}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionMenu)
