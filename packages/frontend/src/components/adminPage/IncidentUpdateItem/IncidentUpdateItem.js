import React, { PropTypes } from 'react'
import classnames from 'classnames'
import AutolinkedText from 'components/common/AutolinkedText'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import TextField from 'components/common/TextField'
import { getFormattedDateTime } from 'utils/datetime'
import classes from './IncidentUpdateItem.scss'

export default class IncidentUpdateItem extends React.Component {
  static propTypes = {
    incidentID: PropTypes.string.isRequired,
    incidentUpdateID: PropTypes.string.isRequired,
    incidentUpdate: PropTypes.shape({
      incidentID: PropTypes.string.isRequired,
      incidentUpdateID: PropTypes.string.isRequired,
      incidentStatus: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    }).isRequired,
    updateIncidentUpdate: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      message: props.incidentUpdate.message,
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

  save = () => {
    this.props.updateIncidentUpdate({...this.props.incidentUpdate, message: this.state.message},
                                    this.updateCallbacks)
  }

  handleChangeMessage = (value) => {
    this.setState({message: value})
  }

  render () {
    const { incidentUpdate } = this.props
    let message
    if (this.state.isEditing) {
      message = (
        <div>
          <ErrorMessage message={this.state.errorMessage} />
          <TextField text={this.state.message} rows={1} onChange={this.handleChangeMessage} />
          <div className={classes['message-bottons']}>
            <Button onClick={this.cancelEdit} name='Cancel' />
            <Button onClick={this.save} name='Save'
              class='mdl-button--accent' disabled={this.state.isUpdating} />
          </div>
        </div>
      )
    } else {
      message = <AutolinkedText text={incidentUpdate.message} />
    }

    return (
      <li key={incidentUpdate.incidentUpdateID} className={classnames('mdl-list__item',
        'mdl-list__item--two-line', 'mdl-shadow--2dp', classes.incident_update_item)}>
        <span className={classnames('mdl-list__item-primary-content', classes.incident_update_item_content)}>
          <span>
            {incidentUpdate.incidentStatus} - updated at {getFormattedDateTime(incidentUpdate.createdAt)}
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
