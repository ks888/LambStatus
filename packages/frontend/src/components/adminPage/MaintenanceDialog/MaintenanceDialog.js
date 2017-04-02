import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import RadioButtonGroup from 'components/common/RadioButtonGroup'
import TextField from 'components/common/TextField'
import ErrorMessage from 'components/common/ErrorMessage'
import ComponentStatusSelector from 'components/adminPage/ComponentStatusSelector'
import TimeSelector from 'components/adminPage/TimeSelector'
import IncidentUpdateItem from 'components/adminPage/IncidentUpdateItem'
import { maintenanceStatuses } from 'utils/status'
import { mountDialog, unmountDialog } from 'utils/dialog'
import classes from './MaintenanceDialog.scss'

export const dialogType = {
  add: 1,
  update: 2
}

export default class MaintenanceDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    maintenanceID: PropTypes.string,
    dialogType: PropTypes.number.isRequired,
    maintenance: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      startAt: PropTypes.string.isRequired,
      endAt: PropTypes.string.isRequired,
      maintenanceUpdates: PropTypes.arrayOf(PropTypes.shape({
        maintenanceUpdateID: PropTypes.string.isRequired,
        maintenanceStatus: PropTypes.string.isRequired,
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
    fetchMaintenanceUpdates: PropTypes.func.isRequired,
    postMaintenance: PropTypes.func.isRequired,
    updateMaintenance: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    if (props.maintenance) {
      this.state = {
        name: props.maintenance.name,
        maintenanceStatus: props.maintenance.status,
        startAt: props.maintenance.startAt,
        endAt: props.maintenance.endAt
      }
    } else {
      this.state = {
        name: '',
        maintenanceStatus: maintenanceStatuses[0],
        startAt: undefined,
        endAt: undefined
      }
    }
    this.state.components = props.components
    this.state.isUpdating = false
    this.state.maintenanceMessage = ''
    this.state.message = ''
  }

  componentDidMount () {
    const fetchCallbacks = {
      onFailure: (msg) => {
        this.setState({message: msg})
      }
    }
    this.props.fetchComponents(fetchCallbacks)
    if (this.props.maintenance) {
      this.props.fetchMaintenanceUpdates(this.props.maintenance.maintenanceID, fetchCallbacks)
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

  handleChangeStartAt = (value) => {
    this.setState({startAt: value})
  }

  handleChangeEndAt = (value) => {
    this.setState({endAt: value})
  }

  handleChangeMaintenanceStatus = (value) => {
    this.setState({maintenanceStatus: value})
  }

  handleChangeMaintenanceMessage = (value) => {
    this.setState({maintenanceMessage: value})
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
    this.props.postMaintenance(this.state.name, this.state.maintenanceStatus,
      this.state.maintenanceMessage, this.state.components, this.updateCallbacks)
  }

  handleClickUpdateButton = (e) => {
    this.props.updateMaintenance(this.props.maintenance.maintenanceID, this.state.name,
      this.state.maintenanceStatus, this.state.maintenanceMessage, this.state.components,
      this.updateCallbacks)
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
    this.props.onClosed()
  }

  renderMaintenanceUpdates = () => {
    if (!this.props.maintenance || !this.props.maintenance.maintenanceUpdates) {
      return
    }
    const updates = this.props.maintenance.maintenanceUpdates.map((maintenanceUpdate) => {
      return (
        <IncidentUpdateItem key={maintenanceUpdate.maintenanceUpdateID} maintenanceUpdate={maintenanceUpdate} />
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

    const startTimeSelector = (
      <TimeSelector title='Maintenance Start Time' default={this.state.startAt}
        onSelected={this.handleChangeStartAt} className={classes.timeselector} />
    )
    const endTimeSelector = (
      <TimeSelector title='Maintenance End Time' default={this.state.endAt}
        onSelected={this.handleChangeEndAt} />
    )

    const maintenanceStatusSelector = (
      <RadioButtonGroup title='Maintenance Status' candidates={maintenanceStatuses}
        checkedCandidate={this.state.maintenanceStatus} onClicked={this.handleChangeMaintenanceStatus}
        className={classes.status} />
    )

    let componentStatusSelectors
    if (this.props.dialogType !== dialogType.add) {
      componentStatusSelectors = (
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
    }

    const maintenanceUpdates = this.renderMaintenanceUpdates()
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h4 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Scheduled Maintenance
      </h4>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        {maintenanceStatusSelector}
        {startTimeSelector}
        {endTimeSelector}
        <TextField label='Message' text={this.state.maintenanceMessage} rows={2}
          onChange={this.handleChangeMaintenanceMessage} />
        {componentStatusSelectors}
        {maintenanceUpdates}
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={clickHandler} name={actionName}
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}
