import React, { PropTypes } from 'react'
import moment from 'moment-timezone'
import classnames from 'classnames'
import IncidentItem from 'components/statusPage/IncidentItem'
import MaintenanceItem from 'components/statusPage/MaintenanceItem'
import { maintenanceStatuses } from 'utils/status'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './Incidents.scss'

export default class Incidents extends React.Component {
  static propTypes = {
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
    maintenances: PropTypes.arrayOf(PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      maintenanceUpdates: PropTypes.arrayOf(PropTypes.shape({
        maintenanceUpdateID: PropTypes.string.isRequired,
        maintenanceStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }).isRequired).isRequired,
    classNames: PropTypes.string,
    fetchIncidents: PropTypes.func.isRequired,
    fetchIncidentUpdates: PropTypes.func.isRequired,
    fetchMaintenances: PropTypes.func.isRequired,
    fetchMaintenanceUpdates: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.dateFormat = 'MMM DD, YYYY'
    this.numDisplayDates = 14
    this.state = {
      needIncidentUpdates: false,
      needMaintenanceUpdates: false
    }
  }

  componentDidMount () {
    this.props.fetchIncidents({ onSuccess: () => { this.setState({needIncidentUpdates: true}) } })
    this.props.fetchMaintenances({ onSuccess: () => { this.setState({needMaintenanceUpdates: true}) } })
  }

  componentWillReceiveProps (nextProps) {
    const firstDateToShow = moment().subtract(this.numDisplayDates, 'days').toISOString()
    if (this.state.needIncidentUpdates) {
      nextProps.incidents.forEach(incident => {
        if (incident.updatedAt < firstDateToShow) return
        this.props.fetchIncidentUpdates(incident.incidentID)
      })
      this.setState({needIncidentUpdates: false})
    }

    if (this.state.needMaintenanceUpdates) {
      nextProps.maintenances.forEach(maintenance => {
        if (maintenance.updatedAt < firstDateToShow) return
        this.props.fetchMaintenanceUpdates(maintenance.maintenanceID)
      })
      this.setState({needMaintenanceUpdates: false})
    }
  }

  renderDateItem = (date, incidents) => {
    const dateItems = incidents.incidents.map(incident =>
      <IncidentItem key={incident.incidentID} incident={incident} />
    )

    incidents.maintenances.forEach(maint => {
      const item = (<MaintenanceItem key={maint.maintenanceID} maintenanceID={maint.maintenanceID} />)
      dateItems.push(item)
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
    const dates = [...Array(this.numDisplayDates).keys()].reduce((dates, index) => {
      const date = moment().subtract(index, 'days').format(this.dateFormat)
      dates[date] = {
        incidents: [],
        maintenances: []
      }
      return dates
    }, {})

    incidents.forEach(incident => {
      const updatedAt = getDateTimeFormat(incident.updatedAt, this.dateFormat)
      if (dates.hasOwnProperty(updatedAt)) dates[updatedAt].incidents.push(incident)
    })

    const lastStatus = maintenanceStatuses[maintenanceStatuses.length - 1]
    maintenances.forEach(maintenance => {
      const updatedAt = getDateTimeFormat(maintenance.updatedAt, this.dateFormat)
      if (dates.hasOwnProperty(updatedAt) && maintenance.status === lastStatus) {
        dates[updatedAt].maintenances.push(maintenance)
      }
    })

    return (
      <div className={this.props.classNames}>
        <h4 className={classnames(classes.title)}>Incidents</h4>
        {Object.keys(dates).map((date) =>
          this.renderDateItem(date, dates[date])
        )}
      </div>
    )
  }
}
