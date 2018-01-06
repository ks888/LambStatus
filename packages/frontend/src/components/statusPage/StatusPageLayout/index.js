import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchPublicSettings } from 'actions/settings'
import StatusPageLayout from './StatusPageLayout'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchSettings: fetchPublicSettings}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusPageLayout)
