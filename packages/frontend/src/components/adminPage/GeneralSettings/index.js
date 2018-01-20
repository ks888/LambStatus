import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateSettings, postApiKey, deleteApiKey } from 'actions/settings'
import GeneralSettings from './GeneralSettings'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({updateSettings, postApiKey, deleteApiKey}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralSettings)
