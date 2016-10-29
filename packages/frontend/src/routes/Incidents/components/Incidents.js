import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { fetchIncidents, fetchIncidentUpdates, fetchComponents, postIncident,
  updateIncident, deleteIncident } from '../modules/incidents'
import IncidentDialog from 'components/IncidentDialog'
import FoolproofDialog from 'components/FoolproofDialog'
import Button from 'components/Button'
import Snackbar from 'components/Snackbar'
import classnames from 'classnames'
import classes from './Incidents.scss'
import moment from 'moment-timezone'
import { getIncidentColor } from 'utils/status'

const dialogType = {
  none: 0,
  add: 1,
  update: 2,
  delete: 3
}

class Incidents extends React.Component {
  constructor () {
    super()
    this.state = { dialogType: dialogType.none, incident: null }
  }

  componentDidMount () {
    this.props.dispatch(fetchIncidents)
    this.props.dispatch(fetchComponents)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.incident !== null) {
      nextProps.incidents.forEach((incident) => {
        if (incident.incidentID === this.state.incident.incidentID) {
          this.setState({ incident: incident })
        }
      })
    }
  }

  componentDidUpdate () {
    let dialog = ReactDOM.findDOMNode(this.refs.incidentDialog) || ReactDOM.findDOMNode(this.refs.foolproofDialog)
    if (dialog) {
      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      try {
        dialog.showModal()

        // workaround https://github.com/GoogleChrome/dialog-polyfill/issues/105
        let overlay = document.querySelector('._dialog_overlay')
        if (overlay) {
          overlay.style = null
        }
      } catch (ex) {
        console.warn('Failed to show dialog (the dialog may be already shown)')
      }
    }
  }

  handleShowDialog = (type, incident) => {
    this.setState({ incident: incident, dialogType: type })
  }

  handleShowAddDialog = () => {
    return () => {
      let defaultIncident = {
        incidentID: '',
        name: '',
        message: ''
      }
      this.handleShowDialog(dialogType.add, defaultIncident)
    }
  }

  handleShowUpdateDialog = (incident) => {
    return () => {
      this.props.dispatch(fetchIncidentUpdates(incident.incidentID))
      this.handleShowDialog(dialogType.update, incident)
    }
  }

  handleShowDeleteDialog = (incident) => {
    return () => this.handleShowDialog(dialogType.delete, incident)
  }

  handleHideDialog = (refs) => {
    let dialog = ReactDOM.findDOMNode(refs)
    dialog.close()
    this.setState({ incident: null, dialogType: dialogType.none })
  }

  handleHideIncidentDialog = () => {
    return () => this.handleHideDialog(this.refs.incidentDialog)
  }

  handleHideFoolproofDialog = () => {
    return () => this.handleHideDialog(this.refs.foolproofDialog)
  }

  handleAdd = (incidentID, name, incidentStatus, message, components) => {
    this.props.dispatch(postIncident(incidentID, name, incidentStatus, message, components))
    this.handleHideDialog(this.refs.incidentDialog)
  }

  handleUpdate = (incidentID, name, incidentStatus, message, components) => {
    this.props.dispatch(updateIncident(incidentID, name, incidentStatus, message, components))
    this.handleHideDialog(this.refs.incidentDialog)
  }

  handleDelete = (incidentID) => {
    this.props.dispatch(deleteIncident(incidentID))
    this.handleHideDialog(this.refs.foolproofDialog)
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

  renderDialog = () => {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        dialog = <IncidentDialog ref='incidentDialog' onCompleted={this.handleAdd}
          onCanceled={this.handleHideIncidentDialog()}
          incident={this.state.incident}
          components={this.props.serviceComponents}
          actionName='Add' />
        break
      case dialogType.update:
        dialog = <IncidentDialog ref='incidentDialog' onCompleted={this.handleUpdate}
          onCanceled={this.handleHideIncidentDialog()}
          incident={this.state.incident}
          components={this.props.serviceComponents}
          actionName='Update' />
        break
      case dialogType.delete:
        dialog = <FoolproofDialog ref='foolproofDialog' onCompleted={this.handleDelete}
          onCanceled={this.handleHideFoolproofDialog()}
          name={this.state.incident.name} ID={this.state.incident.incidentID} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { incidents, isFetching, message } = this.props
    const incidentItems = incidents.map(this.renderListItem)
    const dialog = this.renderDialog()
    const snackbar = <Snackbar message={message} />
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Incident
    </div>)

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--10-col mdl-cell--middle'>
        <h4>Incidents</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--2-col mdl-cell--middle')}>
        <Button onClick={this.handleShowAddDialog()} name={textInButton} class='mdl-button--accent' />
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {incidentItems}
      </ul>
      {dialog}
      {snackbar}
    </div>)
  }
}

Incidents.propTypes = {
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
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.incidents.isFetching,
    incidents: state.incidents.incidents,
    serviceComponents: state.incidents.components,
    message: state.incidents.message
  }
}

export default connect(mapStateToProps)(Incidents)
