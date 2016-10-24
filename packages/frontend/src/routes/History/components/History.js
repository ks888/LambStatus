import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { fetchIncidents, fetchIncidentUpdates } from '../modules/history'
import classnames from 'classnames'
import classes from './History.scss'
import moment from 'moment-timezone'
import { getIncidentColor } from 'utils/status'

class History extends React.Component {
  componentDidMount () {
    this.props.dispatch(fetchIncidents)
  }

  renderIncidentUpdateItem = (incidentUpdate) => {
    const updatedAt = moment.tz(incidentUpdate.updatedAt, moment.tz.guess()).format('MMM DD, YYYY - HH:mm (z)')

    return (
      <div className={classnames(classes.incident_update_item)} key={incidentUpdate.incidentUpdateID}>
        <div>
          {incidentUpdate.incidentStatus}
          <span className={classnames(classes.incident_update_item_message)}> - {incidentUpdate.message}</span>
        </div>
        <div className={classnames(classes.incident_update_item_updatedat)}>
          {updatedAt}
        </div>
      </div>
    )
  }

  renderIncidentItem = (incident) => {
    const statusColor = getIncidentColor(incident.status)
    const updatedAt = moment.tz(incident.updatedAt, moment.tz.guess()).format('MMM DD, YYYY - HH:mm (z)')
    const incidentItem = (
      <li key={incident.incidentID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--4dp', classes.incident_item)}>
        <div className={classnames('mdl-list__item-primary-content', classes.incident_item_primary)}
          style={{color: statusColor}}>
            {incident.status} - {incident.name}
        </div>
        <span className='mdl-list__item-sub-title'>
          {updatedAt}
        </span>
      </li>
    )
    return incidentItem
  }

  renderIncidentItems = (month, incidents) => {
    const incidentItems = incidents.map((incident) =>
      this.renderIncidentItem(incident)
    )

    return (
      <li key={month} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.date_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.date_item_primary)}>
          <div className={classnames(classes.border)}>{month}</div>
          <span className='mdl-list__item-sub-title'>
            <ul className='mdl-list'>
              {incidentItems}
            </ul>
          </span>
        </span>
      </li>
    )
  }

  renderIncidentsByMonth = (incidents) => {
    const dateFormat = 'MMMM YYYY'
    let months = {}
    incidents.forEach((incident) => {
      const updatedAt = moment.tz(incident.updatedAt, moment.tz.guess()).format(dateFormat)
      if (!months.hasOwnProperty(updatedAt)) {
        months[updatedAt] = [incident]
      } else {
        months[updatedAt].push(incident)
      }
    })

    return Object.keys(months).map((month) =>
      this.renderIncidentItems(month, months[month])
    )
  }

  render () {
    const { incidents, isFetching } = this.props
    const incidentsByMonth = this.renderIncidentsByMonth(incidents)

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: isFetching ? 0.5 : 1 }}>
      <h4>
        <span className={classes.title_service}>Service</span>
        <span className={classes.title_status}>Status</span>
      </h4>
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>Incidents</h4>
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        {incidentsByMonth}
      </div>
    </div>)
  }
}

History.propTypes = {
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
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.history.isFetching,
    incidents: state.history.incidents
  }
}

export default connect(mapStateToProps)(History)
