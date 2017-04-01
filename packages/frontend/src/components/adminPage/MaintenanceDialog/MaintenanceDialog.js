import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import AutolinkedText from 'components/common/AutolinkedText'
import Button from 'components/common/Button'
import RadioButton from 'components/common/RadioButton'
import TextField from 'components/common/TextField'
import DropdownList from 'components/common/DropdownList'
import ErrorMessage from 'components/common/ErrorMessage'
import { componentStatuses, maintenanceStatuses } from 'utils/status'
import { getDateTimeFormat } from 'utils/datetime'
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
        maintenanceStatus: props.maintenance.status
      }
    } else {
      this.state = {
        name: '',
        maintenanceStatus: maintenanceStatuses[0]
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
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
    this.props.onClosed()
  }

  renderMaintenanceStatuses = () => {
    const statusDOMs = maintenanceStatuses.map((status) => {
      let checked = status === this.state.maintenanceStatus
      return (
        <RadioButton key={status} onChange={this.handleChangeMaintenanceStatus} label={status}
          checked={checked} groupName='status' />
      )
    })
    return (
      <div>
        <label className={classes.label} htmlFor='statuses'>
          Maintenance Status
        </label>
        <div className={classes.maintenance_status} id='statuses'>
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

  renderMaintenanceUpdateItem = (maintenanceUpdate) => {
    return (
      <li key={maintenanceUpdate.maintenanceUpdateID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.maintenance_update_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.maintenance_update_item_content)}>
          <span>{maintenanceUpdate.maintenanceStatus} - updated at {getDateTimeFormat(maintenanceUpdate.updatedAt)}</span>
          <span className='mdl-list__item-sub-title'>
            <AutolinkedText text={maintenanceUpdate.message} />
          </span>
        </span>
      </li>
    )
  }

  renderMaintenanceUpdates = () => {
    if (!this.props.maintenance || !this.props.maintenance.maintenanceUpdates) {
      return
    }
    const updates = this.props.maintenance.maintenanceUpdates.map(this.renderMaintenanceUpdateItem)
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

    const maintenanceStatuses = this.renderMaintenanceStatuses()
    const componentStatuses = this.renderComponentStatuses()
    const maintenanceUpdates = this.renderMaintenanceUpdates()
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h4 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Maintenance
      </h4>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        {maintenanceStatuses}
        <TextField label='Message' text={this.state.maintenanceMessage} rows={2}
          onChange={this.handleChangeMaintenanceMessage} />
        {componentStatuses}
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
