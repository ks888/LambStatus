import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchIncidents, fetchComponents } from '../modules/statuses'
import classnames from 'classnames'
import classes from './Statuses.scss'
import Button from 'components/Button'
import moment from 'moment-timezone'
import { getIncidentColor, getComponentColor } from 'utils/status'

class Statuses extends React.Component {
  constructor () {
    super()
    this.dateFormat = 'MMM DD, YYYY'
  }

  componentDidMount () {
    this.props.dispatch(fetchIncidents)
    this.props.dispatch(fetchComponents)
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

  renderDatesItem = (date, incidents) => {
    let dateItems
    if (incidents.length === 0) {
      dateItems = <div>No incidents reported</div>
    } else {
      dateItems = incidents.reduce((arr, incident) => {
        const incidentDate = moment.tz(incident.updatedAt, moment.tz.guess()).format(this.dateFormat)
        if (date !== incidentDate) {
          return arr
        }

        const statusColor = getIncidentColor(incident.status)
        const updatedAt = moment.tz(incident.updatedAt, moment.tz.guess()).format('MMM DD, YYYY - HH:mm (z)')
        const incidentItem = (
          <li key={incident.incidentID} className={classnames('mdl-list__item',
            'mdl-list__item--two-line', 'mdl-shadow--4dp', classes.date_item)}>
            <span className={classnames('mdl-list__item-primary-content', classes.date_item_primary)}>
              <span>
                <span style={{color: statusColor}}>{incident.status}</span> - {incident.name}
              </span>
              <span className='mdl-list__item-sub-title'>
                {updatedAt}
              </span>
            </span>
            <span className='mdl-list__item-secondary-content'>
              <Button plain name='Detail' />
            </span>
          </li>
        )
        arr.push(incidentItem)
        return arr
      }, [])
      dateItems = (
        <ul className='mdl-list'>
          {dateItems}
        </ul>
      )
    }
    return (
      <li key={date} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.date_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.date_item_primary)}>
          <div className={classnames(classes.border)}>{date}</div>
          <span className='mdl-list__item-sub-title'>
            {dateItems}
          </span>
        </span>
      </li>
    )
  }

  render () {
    const { incidents, serviceComponents, isFetching } = this.props
    const componentItems = serviceComponents.map(this.renderComponentItem)
    const numDays = 14
    const dates = [...Array(numDays).keys()].reduce((obj, index) => {
      const date = moment().subtract(index, 'days').format(this.dateFormat)
      obj[date] = []
      return obj
    }, {})
    incidents.map((incident) => {
      let updatedDates = new Set()
      incident.incidentUpdates.map((incidentUpdate) => {
        const updatedAt = moment.tz(incidentUpdate.updatedAt, moment.tz.guess()).format(this.dateFormat)
        updatedDates.add(updatedAt)
      })
      updatedDates.forEach((updatedDate) => {
        dates[updatedDate].push(incident)
      })
    })
    const dateItems = Object.keys(dates).map((date) =>
      this.renderDatesItem(date, dates[date])
    )

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: isFetching ? 0.5 : 1 }}>
      <h4>
        <span className={classes.title_service}>Service</span>
        <span className={classes.title_status}>Status</span>
      </h4>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {componentItems}
      </ul>
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>Incidents</h4>
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        {dateItems}
      </div>
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
    isFetching: state.statuses.isFetching,
    incidents: state.statuses.incidents,
    serviceComponents: state.statuses.components
  }
}

export default connect(mapStateToProps)(Statuses)
