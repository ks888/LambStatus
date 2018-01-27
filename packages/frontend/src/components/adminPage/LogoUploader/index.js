import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadLogo, deleteLogo } from 'actions/settings'
import LogoUploader from './LogoUploader'

const mapStateToProps = (state) => {
  return {
    logoID: state.settings.settings.logoID,
    statusPageURL: state.settings.settings.statusPageURL
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({uploadLogo, deleteLogo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoUploader)
