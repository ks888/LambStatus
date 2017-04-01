import React, { PropTypes } from 'react'
import classnames from 'classnames'
import ModestLink from 'components/common/ModestLink'
import Title from 'components/statusPage/Title'
import IncidentItem from 'components/statusPage/IncidentItem'
import { getDateTimeFormat } from 'utils/datetime'
import classes from './History.scss'

export default class History extends React.Component {
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
    fetchIncidents: PropTypes.func.isRequired,
    fetchIncidentUpdates: PropTypes.func.isRequired
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
  }

  handleShowDetail = (incidentID) => {
    this.props.fetchIncidentUpdates(incidentID, this.fetchCallbacks)
  }

  renderIncidentItems = (month, incidents) => {
    const incidentItems = incidents.map((incident) =>
      <IncidentItem key={incident.incidentID} onDetailClicked={this.handleShowDetail}
        incident={incident} showDetailButton />
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
    let months = {}
    incidents.forEach((incident) => {
      const updatedAt = getDateTimeFormat(incident.updatedAt, 'MMMM YYYY')
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
    const { incidents } = this.props
    const incidentsByMonth = this.renderIncidentsByMonth(incidents)

    return (<div className={classnames(classes.layout, 'mdl-grid')}
      style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
      <Title service_name='Service' />
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>Incident History</h4>
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        {incidentsByMonth}
      </div>
      <ModestLink link='/' text='Current Incidents' />
    </div>)
  }
}
