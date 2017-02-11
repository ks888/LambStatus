import React, { PropTypes } from 'react'
import { serviceName } from 'utils/settings'
import Title from 'components/Title'
import IncidentItem from 'components/IncidentItem'
import ModestLink from 'components/ModestLink'
import MetricsGraph from 'components/MetricsGraph'
import classnames from 'classnames'
import classes from './Statuses.scss'
import moment from 'moment-timezone'
import { getComponentColor } from 'utils/status'
import dummydata from './../MetricsGraph/dummyData1'

export default class Statuses extends React.Component {
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
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchComponents: PropTypes.func.isRequired,
    fetchIncidents: PropTypes.func.isRequired,
    fetchIncidentUpdates: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.dateFormat = 'MMM DD, YYYY'
    this.state = {
      isFetching: false,
      needIncidentUpdates: false,
      message: ''
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
    this.props.fetchIncidents({
      onLoad: this.fetchCallbacks.onLoad,
      onSuccess: () => {
        this.setState({isFetching: false, needIncidentUpdates: true})
      },
      onFailure: this.fetchCallbacks.onFailure
    })
    this.props.fetchComponents(this.fetchCallbacks)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.needIncidentUpdates) {
      nextProps.incidents.forEach((incident) => {
        this.props.fetchIncidentUpdates(incident.incidentID, this.fetchCallbacks)
      })
      this.setState({needIncidentUpdates: false})
    }
  }

  renderComponentItem = (component) => {
    let statusColor = getComponentColor(component.status)
    return (
      <li key={component.componentID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
        <span className='mdl-list__item-primary-content'>
          <span>{component.name}</span>
          <span className='mdl-list__item-sub-title'>{component.description}</span>
        </span>
        <span className='mdl-list__item-secondary-content' style={{color: statusColor}}>
          {component.status}
        </span>
      </li>
    )
  }

  renderDateItem = (date, incidents) => {
    let dateItems
    if (incidents.length === 0) {
      dateItems = <div>No incidents reported</div>
    } else {
      const filteredIncidents = incidents.filter((incident) => {
        const lastUpdatedDate = moment.tz(incident.updatedAt, moment.tz.guess()).format(this.dateFormat)
        return date === lastUpdatedDate
      })
      if (filteredIncidents.length === 0) {
        return null
      }
      dateItems = filteredIncidents.map((incident) =>
        <IncidentItem key={incident.incidentID} incident={incident} showDetailButton={false} />
      )
    }

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

  renderDateItems = (incidents) => {
    const numDays = 14
    const dates = [...Array(numDays).keys()].reduce((obj, index) => {
      const date = moment().subtract(index, 'days').format(this.dateFormat)
      obj[date] = []
      return obj
    }, {})

    incidents.forEach((incident) => {
      if (!incident.incidentUpdates) return

      let updatedDates = new Set()
      incident.incidentUpdates.map((incidentUpdate) => {
        const updatedAt = moment.tz(incidentUpdate.updatedAt, moment.tz.guess()).format(this.dateFormat)
        updatedDates.add(updatedAt)
      })
      updatedDates.forEach((updatedDate) => {
        if (dates.hasOwnProperty(updatedDate)) {
          dates[updatedDate].push(incident)
        }
      })
    })

    return Object.keys(dates).map((date) =>
      this.renderDateItem(date, dates[date])
    )
  }

  render () {
    const { incidents, components } = this.props
    const componentItems = components.map(this.renderComponentItem)
    const dateItems = this.renderDateItems(incidents)

    return (<div className={classnames(classes.layout, 'mdl-grid')}
      style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
      <Title service_name={serviceName} />
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {componentItems}
      </ul>
      <div className='mdl-cell mdl-cell--12-col'>
        <MetricsGraph metricID='data1' title='Average response time'
          data={dummydata} dataunit='ms' timeframe='Month'
          fetchData={() => {}} />
      </div>
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>Incidents</h4>
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        {dateItems}
      </div>
      <ModestLink link='/history' text='Incident History' />
    </div>)
  }
}
