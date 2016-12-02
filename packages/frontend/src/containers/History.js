import { connect } from 'react-redux'
import History from 'components/History'

const mapStateToProps = (state) => {
  return {
    isFetching: state.history.isFetching,
    incidents: state.history.incidents
  }
}

export default connect(mapStateToProps)(History)
