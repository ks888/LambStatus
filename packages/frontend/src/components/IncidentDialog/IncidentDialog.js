import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './IncidentDialog.scss'
import Button from 'components/Button'
import RadioButton from 'components/RadioButton'
import TextField from 'components/TextField'
import DropdownList from 'components/DropdownList'
import { componentStatuses, incidentStatuses } from 'utils/status'

class IncidentDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      incidentID: props.incident.incidentID,
      name: props.incident.name,
      components: props.components,
      incidentStatus: props.incident.incidentStatus || 'investigating',
      message: props.incident.message
    }
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

  handleChangeMessage = (value) => {
    this.setState({message: value})
  }

  handleClickDoneButton = (e) => {
    this.props.onCompleted(this.state.incidentID, this.state.name, this.state.incidentStatus,
      this.state.message, this.state.components)
  }

  renderIncidentStatuses = () => {
    const statusDOMs = incidentStatuses.map((status) => {
      let checked = status === this.state.incidentStatus
      return (
        <RadioButton key={status} onChange={this.handleChangeIncidentStatus} label={status} checked={checked} />
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
    const components = this.props.components.map((component) => {
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
    incidentStatus: PropTypes.string,
    message: PropTypes.string.isRequired
  }).isRequired,
  components: PropTypes.arrayOf(PropTypes.shape({
    componentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired).isRequired,
  actionName: PropTypes.string.isRequired
}

export default IncidentDialog
