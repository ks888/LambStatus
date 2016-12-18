import React, { PropTypes } from 'react'
import classnames from 'classnames'
import moment from 'moment-timezone'
import IncidentDialog from 'containers/IncidentDialog'
import { incidentDialogType } from 'components/IncidentDialog'
import FoolproofDialog from 'components/FoolproofDialog'
import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import { getIncidentColor } from 'utils/status'
import classes from './Incidents.scss'

const dialogType = {
  none: 0,
  add: 1,
  update: 2,
  delete: 3
}

export default class Incidents extends React.Component {
  static propTypes = {
    incidents: PropTypes.arrayOf(PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchIncidents: PropTypes.func.isRequired,
    deleteIncident: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.none,
      incidentID: null,
      isFetching: false,
      message: ''
    }
  }

  componentDidMount () {
    this.props.fetchIncidents({
      onLoad: () => { this.setState({isFetching: true}) },
      onSuccess: () => { this.setState({isFetching: false}) },
      onFailure: (msg) => {
        this.setState({isFetching: false, message: msg})
      }
    })
  }

  handleShowDialog = (type, incidentID) => {
    this.setState({ incidentID, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => this.handleShowDialog(dialogType.add)
  }

  handleShowUpdateDialog = (incidentID) => {
    return () => this.handleShowDialog(dialogType.update, incidentID)
  }

  handleShowDeleteDialog = (incidentID) => {
    return () => this.handleShowDialog(dialogType.delete, incidentID)
  }

  handleCloseDialog = () => {
    this.setState({ incidentID: null, dialogType: dialogType.none })
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
                onClick={this.handleShowUpdateDialog(incident.incidentID)} />
            </div>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Delete'
                onClick={this.handleShowDeleteDialog(incident.incidentID)} />
            </div>
          </div>
        </span>
      </li>
    )
  }

  renderDialog = () => {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        dialog = <IncidentDialog onClosed={this.handleCloseDialog}
          dialogType={incidentDialogType.add} />
        break
      case dialogType.update:
        dialog = <IncidentDialog onClosed={this.handleCloseDialog}
          incidentID={this.state.incidentID} dialogType={incidentDialogType.update} />
        break
      case dialogType.delete:
        let incidentName
        this.props.incidents.forEach((incident) => {
          if (incident.incidentID === this.state.incidentID) {
            incidentName = incident.name
          }
        })
        dialog = <FoolproofDialog onClosed={this.handleCloseDialog}
          name={incidentName} ID={this.state.incidentID}
          deleteFunction={this.props.deleteIncident} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { incidents } = this.props
    const incidentItems = incidents.map(this.renderListItem)
    const dialog = this.renderDialog()
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Incident
    </div>)

    return (<div className={classnames(classes.layout, 'mdl-grid')}
      style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--10-col mdl-cell--middle'>
        <h4>Incidents</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--2-col mdl-cell--middle')}>
        <Button onClick={this.handleShowAddDialog()} name={textInButton} class='mdl-button--accent' />
      </div>
      <div className='mdl-cell mdl-cell--12-col mdl-list'>
        <ErrorMessage message={this.state.message} />
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {incidentItems}
      </ul>
      <div id='inner-dialog-container'>
        {dialog}
      </div>
    </div>)
  }
}
