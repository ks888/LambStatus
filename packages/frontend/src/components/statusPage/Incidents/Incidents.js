import React, { PropTypes } from 'react'
import moment from 'moment-timezone'
import classnames from 'classnames'
import IncidentItem from 'components/statusPage/IncidentItem'
import MaintenanceItem from 'components/statusPage/MaintenanceItem'
import { maintenanceStatuses } from 'utils/status'
import { getFormattedDateTime } from 'utils/datetime'
import classes from './Incidents.scss'

export default class Incidents extends React.Component {
  static propTypes = {
    incidents: PropTypes.arrayOf(PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    maintenances: PropTypes.arrayOf(PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    classNames: PropTypes.string,
    fetchIncidents: PropTypes.func.isRequired,
    fetchMaintenances: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.dateFormat = 'MMM DD, YYYY'
    this.numDisplayDates = 14
  }

  componentDidMount () {
    if (this.props.incidents.length === 0) { this.props.fetchIncidents() }
    if (this.props.maintenances.length === 0) { this.props.fetchMaintenances() }
  }

  renderDateItem = (date, events) => {
    const dateItems = events.map(event => {
      if (event.hasOwnProperty('incidentID')) {
        return (<IncidentItem key={event.incidentID} incidentID={event.incidentID} autoloadDetail />)
      } else if (event.hasOwnProperty('maintenanceID')) {
        return (<MaintenanceItem key={event.maintenanceID} maintenanceID={event.maintenanceID} autoloadDetail />)
      } else {
        throw new Error('Unknown event: ', event)
      }
    })

    return (
      <li key={date} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.date_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.date_item_primary)}>
          <div className={classnames(classes.border)}>{date}</div>
          <span className='mdl-list__item-sub-title'>
            <ul className='mdl-list'>
              {dateItems}
            </ul>
          </span>
        </span>
      </li>
    )
  }

  render () {
    const { incidents, maintenances } = this.props
    const dates = {}
    for (let i = 0; i < this.numDisplayDates; i++) {
      const date = moment().subtract(i, 'days').format(this.dateFormat)
      dates[date] = []
    }

    incidents.forEach(incident => {
      const updatedAt = getFormattedDateTime(incident.updatedAt, this.dateFormat)
      if (dates.hasOwnProperty(updatedAt)) dates[updatedAt].push(incident)
    })

    const lastStatus = maintenanceStatuses[maintenanceStatuses.length - 1]
    maintenances.forEach(maintenance => {
      const updatedAt = getFormattedDateTime(maintenance.updatedAt, this.dateFormat)
      if (dates.hasOwnProperty(updatedAt) && maintenance.status === lastStatus) {
        dates[updatedAt].push(maintenance)
      }
    })

    Object.keys(dates).map(date => dates[date].sort((a, b) => { return a.updatedAt < b.updatedAt }))

    return (
      <div className={this.props.classNames}>
        <h4 className={classnames(classes.title)}>Incidents</h4>
        {Object.keys(dates).map(date =>
          this.renderDateItem(date, dates[date])
        )}
      </div>
    )
  }
}
