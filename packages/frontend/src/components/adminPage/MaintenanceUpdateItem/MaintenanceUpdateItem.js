import React, { PropTypes } from 'react'
import classnames from 'classnames'
import AutolinkedText from 'components/common/AutolinkedText'
import MiniEditor from 'components/common/MiniEditor'
import { getFormattedDateTime } from 'utils/datetime'
import classes from './MaintenanceUpdateItem.scss'

export default class MaintenanceUpdateItem extends React.Component {
  static propTypes = {
    maintenanceID: PropTypes.string.isRequired,
    maintenanceUpdateID: PropTypes.string.isRequired,
    maintenanceUpdate: PropTypes.shape({
      maintenanceID: PropTypes.string.isRequired,
      maintenanceUpdateID: PropTypes.string.isRequired,
      maintenanceStatus: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    }).isRequired,
    updateMaintenanceUpdate: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      message: props.maintenanceUpdate.message,
      isEditing: false,
      isUpdating: false,
      errorMessage: ''
    }
  }

  updateCallbacks = {
    onLoad: () => { this.setState({isUpdating: true}) },
    onSuccess: () => { this.setState({isUpdating: false, isEditing: false}) },
    onFailure: (msg) => { this.setState({isUpdating: false, errorMessage: msg}) }
  }

  startEdit = () => {
    this.setState({isEditing: true})
  }

  cancelEdit = () => {
    this.setState({isEditing: false})
  }

  save = (message) => {
    this.props.updateMaintenanceUpdate({...this.props.maintenanceUpdate, message}, this.updateCallbacks)
  }

  render () {
    const { maintenanceUpdate } = this.props
    let message
    if (this.state.isEditing) {
      message = (
        <MiniEditor onSave={this.save} onCancel={this.cancelEdit} initialText={this.props.maintenanceUpdate.message}
          errorMessage={this.state.errorMessage} isUpdating={this.state.isUpdating} />
      )
    } else {
      message = <AutolinkedText text={maintenanceUpdate.message} />
    }

    return (
      <li key={maintenanceUpdate.maintenanceUpdateID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.maintenance_update_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.maintenance_update_item_content)}>
          <span>
            {maintenanceUpdate.maintenanceStatus} - updated at {getFormattedDateTime(maintenanceUpdate.createdAt)}
            <i className={classnames(classes.icon, 'material-icons')} onClick={this.startEdit}>edit</i>
          </span>
          <span className='mdl-list__item-sub-title'>
            {message}
          </span>
        </span>
      </li>
    )
  }
}
