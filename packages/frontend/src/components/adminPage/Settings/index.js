import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchSettings, updateSettings } from 'actions/settings'
import Settings from './Settings'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({fetchSettings, updateSettings}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
