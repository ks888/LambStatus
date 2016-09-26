import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './ComponentDialog.scss'
import Button from 'components/Button'
import TextField from 'components/TextField'

class ComponentDialog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      componentID: props.component.componentID,
      name: props.component.name,
      description: props.component.description,
      status: props.component.status
    }
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeDescription = this.handleChangeDescription.bind(this)
    this.handleClickDoneButton = this.handleClickDoneButton.bind(this)
  }

  handleChangeName (value) {
    this.setState({name: value})
  }

  handleChangeDescription (value) {
    this.setState({description: value})
  }

  handleClickDoneButton (e) {
    this.props.onCompleted(this.state.componentID, this.state.name, this.state.description, this.state.status)
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)}>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {this.props.actionName} Component
      </h2>
      <div className='mdl-dialog__content'>
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        <TextField label='Description' text={this.state.description} rows={2} onChange={this.handleChangeDescription} />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickDoneButton} name={this.props.actionName} class='mdl-button--accent' />
        <Button onClick={this.props.onCanceled} name='Cancel' />
      </div>
    </dialog>)
  }
}

ComponentDialog.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  onCanceled: PropTypes.func.isRequired,
  component: PropTypes.shape({
    componentID: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired
  }).isRequired,
  actionName: PropTypes.string.isRequired
}

export default ComponentDialog
