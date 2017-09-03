import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import RadioButtonGroup from 'components/common/RadioButtonGroup'
import TextField from 'components/common/TextField'
import ErrorMessage from 'components/common/ErrorMessage'
import ComponentStatusSelector from 'components/adminPage/ComponentStatusSelector'
import IncidentUpdateItem from 'components/adminPage/IncidentUpdateItem'
import { incidentStatuses } from 'utils/status'
import { mountDialog, unmountDialog } from 'utils/dialog'
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

    mountDialog(ReactDOM.findDOMNode(this.refs.dialog))
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
    const params = Object.assign({}, this.state, {message: this.state.incidentMessage})
    this.props.postIncident(params, this.updateCallbacks)
  }

  handleClickUpdateButton = (e) => {
    const params = Object.assign({}, this.state, {
      incidentID: this.props.incident.incidentID,
      message: this.state.incidentMessage
    })
    this.props.updateIncident(params, this.updateCallbacks)
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
    this.props.onClosed()
  }

  renderIncidentUpdates = () => {
    if (!this.props.incident || !this.props.incident.incidentUpdates) {
      return
    }
    const updates = this.props.incident.incidentUpdates.map((incidentUpdate) => {
      incidentUpdate.updateID = incidentUpdate.incidentUpdateID
      incidentUpdate.status = incidentUpdate.incidentStatus
      return (
        <IncidentUpdateItem key={incidentUpdate.updateID} incidentUpdate={incidentUpdate} />
      )
    })
    return (
      <div>
        <h4>Previous Updates</h4>
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

    const incidentStatusSelector = (
      <RadioButtonGroup title='Incident Status' candidates={incidentStatuses}
        checkedCandidate={this.state.incidentStatus} onClicked={this.handleChangeIncidentStatus} />
    )

    const componentStatusSelectors = (
      <div>
        <label className={classes.label} htmlFor='components'>Component Status</label>
        {this.state.components.map((component) => {
          return (
            <ComponentStatusSelector key={component.componentID} component={component}
              onSelected={this.handleChangeComponentStatus(component.componentID)} />
          )
        })}
      </div>
    )

    const incidentUpdates = this.renderIncidentUpdates()
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h4 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Incident
      </h4>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        {incidentStatusSelector}
        <TextField label='Message' text={this.state.incidentMessage} rows={2}
          onChange={this.handleChangeIncidentMessage} />
        {componentStatusSelectors}
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
