import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
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
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchComponents: PropTypes.func.isRequired,
    fetchIncidents: PropTypes.func.isRequired,
    fetchIncidentUpdates: PropTypes.func.isRequired,
    postIncident: PropTypes.func.isRequired,
    updateIncident: PropTypes.func.isRequired,
    deleteIncident: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.none,
      incident: null,
      isFetching: false,
      isUpdating: false,
      message: ''
    }
  }

  componentDidMount () {
    const fetchCallbacks = {
      onLoad: () => { this.setState({isFetching: true}) },
      onSuccess: () => { this.setState({isFetching: false}) },
      onFailure: (msg) => {
        this.setState({isFetching: false, message: msg})
      }
    }
    this.props.fetchIncidents(fetchCallbacks)
    this.props.fetchComponents(fetchCallbacks)
  }

  componentWillReceiveProps (nextProps) {
    // Set fetched incident updates
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
    if (dialog && !dialog.showModal) {
      // dialog polyfill has a limitation that the dialog should have a child of parents without parents.
      // Here is a workaround for this limitation.
      document.getElementById('dialog-container').appendChild(dialog)

      dialogPolyfill.registerDialog(dialog)
      dialog.showModal()
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
      this.props.fetchIncidentUpdates(incident.incidentID)
      this.handleShowDialog(dialogType.update, incident)
    }
  }

  handleShowDeleteDialog = (incident) => {
    return () => this.handleShowDialog(dialogType.delete, incident)
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.incidentDialog) || ReactDOM.findDOMNode(this.refs.foolproofDialog)
    if (dialog) {
      dialog.close()

      document.getElementById('inner-dialog-container').appendChild(dialog)

      this.setState({ incident: null, dialogType: dialogType.none })
    }
  }

  updateCallbacks = {
    onLoad: () => { this.setState({isUpdating: true}) },
    onSuccess: () => {
      this.setState({isUpdating: false})
      this.handleHideDialog()
    },
    onFailure: (msg) => {
      this.setState({isUpdating: false, message: msg})
    }
  }

  handleAdd = (incidentID, name, incidentStatus, message, components) => {
    this.props.postIncident(incidentID, name, incidentStatus, message, components, this.updateCallbacks)
  }

  handleUpdate = (incidentID, name, incidentStatus, message, components) => {
    this.props.updateIncident(incidentID, name, incidentStatus, message, components, this.updateCallbacks)
  }

  handleDelete = (incidentID) => {
    this.props.deleteIncident(incidentID, this.updateCallbacks)
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
          onCanceled={this.handleHideDialog}
          isUpdating={this.state.isUpdating}
          incident={this.state.incident}
          components={this.props.components}
          actionName='Add' />
        break
      case dialogType.update:
        dialog = <IncidentDialog ref='incidentDialog' onCompleted={this.handleUpdate}
          onCanceled={this.handleHideDialog}
          isUpdating={this.state.isUpdating}
          incident={this.state.incident}
          components={this.props.components}
          actionName='Update' />
        break
      case dialogType.delete:
        dialog = <FoolproofDialog ref='foolproofDialog' onCompleted={this.handleDelete}
          onCanceled={this.handleHideDialog}
          isUpdating={this.state.isUpdating}
          name={this.state.incident.name} ID={this.state.incident.incidentID} />
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
    const snackbar = <Snackbar message={this.state.message} />
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
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {incidentItems}
      </ul>
      <div id='inner-dialog-container'>
        {dialog}
      </div>
      {snackbar}
    </div>)
  }
}
