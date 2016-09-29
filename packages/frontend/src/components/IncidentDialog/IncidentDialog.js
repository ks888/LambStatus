import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './IncidentDialog.scss'
import Button from 'components/Button'
import RadioButton from 'components/RadioButton'
import TextField from 'components/TextField'
import DropdownList from 'components/DropdownList'

class IncidentDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      incidentID: props.incident.incidentID,
      name: props.incident.name,
      componentStatus: props.incident.componentStatus,
      incidentStatus: props.incident.incidentStatus,
      message: props.incident.message
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeComponentStatus = this.handleChangeComponentStatus.bind(this)
    this.handleChangeIncidentStatus = this.handleChangeIncidentStatus.bind(this)
    this.handleClickDoneButton = this.handleClickDoneButton.bind(this)
    this.renderIncidentStatuses = this.renderIncidentStatuses.bind(this)
    this.handleChangeMessage = this.handleChangeMessage.bind(this)
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

  handleChangeMessage (value) {
    this.setState({message: value})
  }

  handleClickDoneButton (e) {
    this.props.onCompleted(this.state.incidentID, this.state.name, this.state.componentStatus,
      this.state.componentIDs, this.state.incidentStatus, this.state.message)
  }

  renderIncidentStatuses () {
    const incidentStatuses = ['investigating', 'identified', 'monitoring', 'resolved']
    const statusDOMs = incidentStatuses.map((status) => {
      return (
        <RadioButton onChange={this.handleChangeIncidentStatus} label={status} />
      )
    })
    return (
      <div>
        <label className={classes.label} htmlFor='statuses'>
          Incident Status
        </label>
        <div id='statuses'>
          {statusDOMs}
        </div>
      </div>
    )
  }

  renderComponentStatuses () {
    const statuses = ['Operational', 'Under Maintenance', 'Degraded Performance', 'Outage']
    const doms = this.props.incident.components.map((component) => {
      return (
        <li className='mdl-list__item'>
          <span className='mdl-list__item-primary-content'>
            {component.name}
          </span>
          <span className='mdl-list__item-secondary-action'>
            <DropdownList onChange={this.handleChangeComponentStatus} list={statuses} />
          </span>
        </li>
      )
    })
    return (
      <ul className='mdl-list'>
        {doms}
      </ul>
    )
  }

  render () {
    const incidentStatuses = this.renderIncidentStatuses()
    const componentStatuses = this.renderComponentStatuses()
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {this.props.actionName} Incident
      </h2>
      <div className='mdl-dialog__content'>
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        {incidentStatuses}
        <TextField label='Message' text={this.state.message} rows={2} onChange={this.handleChangeMessage} />
        {componentStatuses}
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
    components: PropTypes.arrayOf(PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired).isRequired,
    incidentStatus: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  }).isRequired,
  actionName: PropTypes.string.isRequired
}

export default IncidentDialog
