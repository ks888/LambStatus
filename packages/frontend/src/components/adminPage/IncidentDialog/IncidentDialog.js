import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import moment from 'moment-timezone'
import AutolinkedText from 'components/common/AutolinkedText'
import Button from 'components/common/Button'
import RadioButton from 'components/common/RadioButton'
import TextField from 'components/common/TextField'
import DropdownList from 'components/common/DropdownList'
import ErrorMessage from 'components/common/ErrorMessage'
import { componentStatuses, incidentStatuses } from 'utils/status'
import classes from './IncidentDialog.scss'

export const dialogType = {
  add: 1,
  update: 2
}

export default class IncidentDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    incidentID: PropTypes.string,
    dialogType: PropTypes.number.isRequired,
    incident: PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      incidentUpdates: PropTypes.arrayOf(PropTypes.shape({
        incidentUpdateID: PropTypes.string.isRequired,
        incidentStatus: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired
      }).isRequired)
    }),
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }).isRequired).isRequired,
    fetchComponents: PropTypes.func.isRequired,
    fetchIncidentUpdates: PropTypes.func.isRequired,
    postIncident: PropTypes.func.isRequired,
    updateIncident: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    if (props.incident) {
      this.state = {
        name: props.incident.name,
        incidentStatus: props.incident.status
      }
    } else {
      this.state = {
        name: '',
        incidentStatus: incidentStatuses[0]
      }
    }
    this.state.components = props.components
    this.state.isUpdating = false
    this.state.incidentMessage = ''
    this.state.message = ''
  }

  componentDidMount () {
    const fetchCallbacks = {
      onFailure: (msg) => {
        this.setState({message: msg})
      }
    }
    this.props.fetchComponents(fetchCallbacks)
    if (this.props.incident) {
      this.props.fetchIncidentUpdates(this.props.incident.incidentID, fetchCallbacks)
    }

    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      // dialog polyfill has a limitation that the dialog should have a child of parents without parents.
      // Here is a workaround for this limitation.
      document.getElementById('dialog-container').appendChild(dialog)

      if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog)
      }
      dialog.showModal()
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({components: nextProps.components})
  }

  handleChangeName = (value) => {
    this.setState({name: value})
  }

  handleChangeComponentStatus = (componentID) => {
    return (status) => {
      let newComponents = this.state.components.map((component) => {
        if (component.componentID === componentID) {
          return Object.assign({}, component, {
            status: status
          })
        }
        return component
      })
      this.setState({components: newComponents})
    }
  }

  handleChangeIncidentStatus = (value) => {
    this.setState({incidentStatus: value})
  }

  handleChangeIncidentMessage = (value) => {
    this.setState({incidentMessage: value})
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

  handleClickAddButton = (e) => {
    this.props.postIncident(this.state.name, this.state.incidentStatus,
      this.state.incidentMessage, this.state.components, this.updateCallbacks)
  }

  handleClickUpdateButton = (e) => {
    this.props.updateIncident(this.props.incident.incidentID, this.state.name,
      this.state.incidentStatus, this.state.incidentMessage, this.state.components,
      this.updateCallbacks)
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
    this.props.onClosed()
  }

  renderIncidentStatuses = () => {
    const statusDOMs = incidentStatuses.map((status) => {
      let checked = status === this.state.incidentStatus
      return (
        <RadioButton key={status} onChange={this.handleChangeIncidentStatus} label={status}
          checked={checked} groupName='status' />
      )
    })
    return (
      <div>
        <label className={classes.label} htmlFor='statuses'>
          Incident Status
        </label>
        <div className={classes.incident_status} id='statuses'>
          {statusDOMs}
        </div>
      </div>
    )
  }

  renderComponentStatuses = () => {
    const components = this.state.components.map((component) => {
      return (
        <div id='components' className={classnames('mdl-grid', classes.components)} key={component.componentID}>
          <span className={classnames('mdl-cell', 'mdl-cell--6-col', 'mdl-cell--middle', classes.component_name)}>
            {component.name}
          </span>
          <span className={classnames('mdl-cell', 'mdl-cell--6-col', 'mdl-cell--middle', classes.component_dropdown)}>
            <DropdownList onChange={this.handleChangeComponentStatus(component.componentID)}
              list={componentStatuses} initialValue={component.status} />
          </span>
        </div>
      )
    })
    return (
      <div>
        <label className={classes.label} htmlFor='components'>Component Status</label>
        {components}
      </div>
    )
  }

  renderIncidentUpdateItem = (incidentUpdate) => {
    const updatedAt = moment.tz(incidentUpdate.updatedAt, moment.tz.guess()).format('MMM DD, YYYY - HH:mm (z)')
    return (
      <li key={incidentUpdate.incidentUpdateID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.incident_update_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.incident_update_item_content)}>
          <span>{incidentUpdate.incidentStatus} - updated at {updatedAt}</span>
          <span className='mdl-list__item-sub-title'>
            <AutolinkedText text={incidentUpdate.message} />
          </span>
        </span>
      </li>
    )
  }

  renderIncidentUpdates = () => {
    if (!this.props.incident || !this.props.incident.incidentUpdates) {
      return
    }
    const updates = this.props.incident.incidentUpdates.map(this.renderIncidentUpdateItem)
    return (
      <div>
        <h4>
          Previous Updates
        </h4>
        <ul className='mdl-cell mdl-cell--12-col mdl-list'>
          {updates}
        </ul>
      </div>
    )
  }

  render () {
    let actionName, clickHandler
    switch (this.props.dialogType) {
      case dialogType.add:
        actionName = 'Add'
        clickHandler = this.handleClickAddButton
        break
      case dialogType.update:
        actionName = 'Update'
        clickHandler = this.handleClickUpdateButton
        break
      default:
        console.warn('unknown dialog type: ', this.props.dialogType)
    }

    const incidentStatuses = this.renderIncidentStatuses()
    const componentStatuses = this.renderComponentStatuses()
    const incidentUpdates = this.renderIncidentUpdates()
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h4 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Incident
      </h4>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        {incidentStatuses}
        <TextField label='Message' text={this.state.incidentMessage} rows={2}
          onChange={this.handleChangeIncidentMessage} />
        {componentStatuses}
        {incidentUpdates}
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={clickHandler} name={actionName}
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}
