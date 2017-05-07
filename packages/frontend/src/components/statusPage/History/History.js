import React, { PropTypes } from 'react'
import classnames from 'classnames'
import ModestLink from 'components/common/ModestLink'
import Title from 'components/statusPage/Title'
import SubscribeButton from 'components/statusPage/SubscribeButton'
import IncidentItem from 'components/statusPage/IncidentItem'
import MaintenanceItem from 'components/statusPage/MaintenanceItem'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './History.scss'

export default class History extends React.Component {
  static propTypes = {
    incidents: PropTypes.arrayOf(PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    maintenances: PropTypes.arrayOf(PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    settings: PropTypes.shape({
      serviceName: PropTypes.string
    }).isRequired,
    fetchIncidents: PropTypes.func.isRequired,
    fetchMaintenances: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      isFetching: false
    }
  }

  fetchCallbacks = {
    onLoad: () => { this.setState({isFetching: true}) },
    onSuccess: () => { this.setState({isFetching: false}) },
    onFailure: (msg) => {
      this.setState({isFetching: false, message: msg})
    }
  }

  componentDidMount () {
    this.props.fetchIncidents(this.fetchCallbacks)
    this.props.fetchMaintenances(this.fetchCallbacks)
  }

  renderEventItems = (month, events) => {
    const eventItems = events.map(event => {
      if (event.hasOwnProperty('incidentID')) {
        return (<IncidentItem key={event.incidentID} incidentID={event.incidentID} />)
      } else if (event.hasOwnProperty('maintenanceID')) {
        return (<MaintenanceItem key={event.maintenanceID} maintenanceID={event.maintenanceID} />)
      } else {
        throw new Error('Unknown event: ', event)
      }
    })

    return (
      <li key={month} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.date_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.date_item_primary)}>
          <div className={classnames(classes.border)}>{month}</div>
          <span className='mdl-list__item-sub-title'>
            <ul className='mdl-list'>
              {eventItems}
            </ul>
          </span>
        </span>
      </li>
    )
  }

  renderEventsByMonth = (events) => {
    let months = {}
    events.forEach(event => {
      const updatedAt = getDateTimeFormat(event.updatedAt, 'MMMM YYYY')
      if (!months.hasOwnProperty(updatedAt)) {
        months[updatedAt] = [event]
      } else {
        months[updatedAt].push(event)
      }
    })

    return Object.keys(months).map(month =>
      this.renderEventItems(month, months[month])
    )
  }

  render () {
    const { incidents, maintenances, settings } = this.props
    const events = incidents.concat(maintenances)
    const eventsByMonth = this.renderEventsByMonth(events)

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className={classnames(classes.top)}>
          <Title service_name={settings.serviceName} />
          <SubscribeButton />
        </div>
        <div className='mdl-cell mdl-cell--12-col'>
          <h4>Incident History</h4>
        </div>
        <div className='mdl-cell mdl-cell--12-col mdl-list'>
          {eventsByMonth}
        </div>
        <ModestLink link='/' text='Current Incidents' />
      </div>
    )
  }
}
