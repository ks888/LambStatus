import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchIncidents, fetchIncidentUpdates, fetchComponents } from '../modules/statuses'
import Button from 'components/Button'
import classnames from 'classnames'
import classes from './Statuses.scss'
import moment from 'moment-timezone'
import { getIncidentColor } from 'utils/status'

class Statuses extends React.Component {
  componentDidMount () {
    this.props.dispatch(fetchIncidents)
    this.props.dispatch(fetchComponents)
  }

  renderListItem = (incident) => {
    let statusColor = getIncidentColor(incident.status)
    let bgColor = '#ffffff'
    let updatedAt = moment.tz(incident.updatedAt, moment.tz.guess()).format('MMM DD, YYYY - HH:mm (z)')
    return (
      <li key={incident.incidentID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.incident_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.incident_item_content)}>
          <i className='material-icons mdl-list__item-avatar'
            style={{ color: statusColor, backgroundColor: bgColor }}>brightness_1</i>
          <div>
            <span>{incident.name}</span>
            <span className='mdl-list__item-sub-title'>
              updated at {updatedAt}
            </span>
          </div>
        </span>
        <span className='mdl-list__item-secondary-content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Update'
                onClick={this.handleShowUpdateDialog(incident)} />
            </div>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Delete'
                onClick={this.handleShowDeleteDialog(incident)} />
            </div>
          </div>
        </span>
      </li>
    )
  }

  render () {
    const { incidents, serviceComponents, isFetching } = this.props
    // const incidentItems = incidents.map(this.renderListItem)

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--10-col mdl-cell--middle'>
        <h4>Service Name</h4>
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
      </ul>
    </div>)
  }
}

Statuses.propTypes = {
  incidents: PropTypes.arrayOf(PropTypes.shape({
    incidentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    incidentUpdates: PropTypes.arrayOf(PropTypes.shape({
      incidentUpdateID: PropTypes.string.isRequired,
      incidentStatus: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired)
  }).isRequired).isRequired,
  serviceComponents: PropTypes.arrayOf(PropTypes.shape({
    componentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired).isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.incidents.isFetching,
    incidents: state.incidents.incidents,
    serviceComponents: state.incidents.components
  }
}

export default connect(mapStateToProps)(Statuses)
