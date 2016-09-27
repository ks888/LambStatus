import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { fetchIncidents, postIncident, updateIncident, deleteIncident } from '../modules/incidents'
import IncidentDialog from 'components/IncidentDialog'
import FoolproofDialog from 'components/FoolproofDialog'
import Button from 'components/Button'
import classnames from 'classnames'
import classes from './IncidentsContainer.scss'
import moment from 'moment-timezone'
import { getIncidentColor } from 'utils/colors'

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

    this.handleShowDialog = this.handleShowDialog.bind(this)
    this.handleHideDialog = this.handleHideDialog.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.renderListItem = this.renderListItem.bind(this)
    this.renderDialog = this.renderDialog.bind(this)
  }

  componentDidMount () {
    this.props.dispatch(fetchIncidents)
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

  handleShowDialog (type, incident) {
    this.setState({ incident: incident, dialogType: type })
  }

  handleHideDialog (refs) {
    let dialog = ReactDOM.findDOMNode(refs)
    dialog.close()
    this.setState({ incident: null, dialogType: dialogType.none })
  }

  handleAdd (incidentID, name, message, incidentStatus, componentIDs, componentStatus) {
    this.props.dispatch(postIncident(incidentID, name, message, incidentStatus, componentIDs, componentStatus))
    this.handleHideDialog(this.refs.incidentDialog)
  }

  handleUpdate (incidentID, name, message, incidentStatus, componentIDs, componentStatus) {
    this.props.dispatch(updateIncident(incidentID, name, message, incidentStatus, componentIDs, componentStatus))
    this.handleHideDialog(this.refs.incidentDialog)
  }

  handleDelete (incidentID) {
    this.props.dispatch(deleteIncident(incidentID))
    this.handleHideDialog(this.refs.foolproofDialog)
  }

  renderListItem (incident) {
    let statusColor = getIncidentColor(incident.status)
    let bgColor = '#ffffff'
    let updatedAt = moment.tz(incident.updatedAt, moment.tz.guess()).format('MMM DD, YYYY - HH:mm (z)')
    return (
      <li key={incident.incidentID} className='mdl-list__item mdl-list__item--two-line mdl-shadow--2dp'>
        <span className='mdl-list__item-primary-content'>
          <i className={classnames(classes.icon, 'material-icons', 'mdl-list__item-avatar')}
            style={{ color: statusColor, backgroundColor: bgColor }}>brightness_1</i>
          <span>{incident.name}</span>
          <span className='mdl-list__item-sub-title'>updated at {updatedAt}</span>
        </span>
        <span className='mdl-list__item-secondary-content'>
          <div className='mdl-grid'>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Edit'
                onClick={() => this.handleShowDialog(dialogType.edit, incident)} />
            </div>
            <div className='mdl-cell mdl-cell--6-col'>
              <Button plain name='Delete'
                onClick={() => this.handleShowDialog(dialogType.delete, incident)} />
            </div>
          </div>
        </span>
      </li>
    )
  }

  renderDialog () {
    let dialog
    switch (this.state.dialogType) {
      case dialogType.none:
        dialog = null
        break
      case dialogType.add:
        let incident = {
          incidentID: '',
          name: '',
          componentStatus: '',
          componentIDs: [],
          incidentStatus: '',
          message: ''
        }
        dialog = <IncidentDialog ref='incidentDialog' onCompleted={this.handleAdd}
          onCanceled={() => { this.handleHideDialog(this.refs.incidentDialog) }}
          incident={incident} actionName='Add' />
        break
      case dialogType.update:
        dialog = <IncidentDialog ref='incidentDialog' onCompleted={this.handleUpdate}
          onCanceled={() => { this.handleHideDialog(this.refs.incidentDialog) }}
          incident={this.state.incident} actionName='Update' />
        break
      case dialogType.delete:
        dialog = <FoolproofDialog ref='foolproofDialog' onCompleted={this.handleDelete}
          onCanceled={() => { this.handleHideDialog(this.refs.foolproofDialog) }}
          incident={this.state.incident} />
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
    return dialog
  }

  render () {
    const { incidents, isFetching } = this.props
    const incidentItems = incidents.map(this.renderListItem)
    const dialog = this.renderDialog()
    const textInButton = (<div>
      <i className='material-icons'>add</i>
      Incident
    </div>)

    return (<div className={classnames(classes.layout, 'mdl-grid')} style={{ opacity: isFetching ? 0.5 : 1 }}>
      <div className='mdl-cell mdl-cell--10-col mdl-cell--middle'>
        <h4>Incidents</h4>
      </div>
      <div className={classnames(classes.showDialogButton, 'mdl-cell mdl-cell--2-col mdl-cell--middle')}>
        <Button onClick={() => this.handleShowDialog(dialogType.add)} name={textInButton} class='mdl-button--accent' />
      </div>
      <ul className='mdl-cell mdl-cell--12-col mdl-list'>
        {incidentItems}
      </ul>
      {dialog}
    </div>)
  }
}

Incidents.propTypes = {
  incidents: PropTypes.arrayOf(PropTypes.shape({
    incidentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  }).isRequired).isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.incidents.isFetching,
    incidents: state.incidents.incidents
  }
}

export default connect(mapStateToProps)(Incidents)
