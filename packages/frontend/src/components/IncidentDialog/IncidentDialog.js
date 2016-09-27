import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './IncidentDialog.scss'
import Button from 'components/Button'
import TextField from 'components/TextField'

class IncidentDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      incidentID: props.incident.incidentID,
      name: props.incident.name,
      componentStatus: props.incident.componentStatus,
      componentIDs: props.incident.componentIDs,
      incidentStatus: props.incident.incidentStatus,
      message: props.incident.message
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeComponentStatus = this.handleChangeComponentStatus.bind(this)
    this.handleChangeIncidentStatus = this.handleChangeIncidentStatus.bind(this)
    this.handleClickDoneButton = this.handleClickDoneButton.bind(this)
    this.renderIncidentStatusItem = this.renderIncidentStatusItem.bind(this)
  }

  handleChangeName (value) {
    this.setState({name: value})
  }

  handleChangeComponentStatus (value) {
    this.setState({componentStatus: value})
  }

  handleChangeIncidentStatus (value) {
    this.setState({incidentStatus: value})
  }

  handleClickDoneButton (e) {
    this.props.onCompleted(this.state.incidentID, this.state.name, this.state.componentStatus,
      this.state.componentIDs, this.state.incidentStatus, this.state.message)
  }

  renderIncidentStatusItem (status) {
    return (
      <label className='mdl-radio mdl-js-radio mdl-js-ripple-effect' htmlFor={status}>
        <input type='radio' id={status} className='mdl-radio__button' name='incidentStatus'
          value={status} checked onChange={this.handleChangeIncidentStatus} />
        <span className='mdl-radio__label'>{status}</span>
      </label>
    )
  }

  render () {
    const incidentStatuses = ['investigating', 'identified', 'monitoring', 'resolved']
    const incidentStatusComponents = incidentStatuses.map(this.renderIncidentStatusItem)
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {this.props.actionName} Incident
      </h2>
      <div className='mdl-dialog__content'>
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        {incidentStatusComponents}
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickDoneButton} name={this.props.actionName} class='mdl-button--accent' />
        <Button onClick={this.props.onCanceled} name='Cancel' />
      </div>
    </dialog>)
  }
}

IncidentDialog.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  onCanceled: PropTypes.func.isRequired,
  incident: PropTypes.shape({
    incidentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    componentStatus: PropTypes.string.isRequired,
    componentIDs: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    incidentStatus: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired,
  actionName: PropTypes.string.isRequired
}

export default IncidentDialog
