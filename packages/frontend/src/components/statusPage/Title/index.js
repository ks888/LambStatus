import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getComponentColor } from 'utils/status'

import Title from './Title'

const anyMajorOutage = (components) => !!components.filter(component => component.status === 'Major Outage').length

const mapStateToProps = (state) => {
  return {
    serviceName: state.settings.settings.serviceName,
    statusColor: getComponentColor(anyMajorOutage(state.components.components) ? 'Major Outage' : 'Operational')
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Title)
