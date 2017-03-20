import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import classes from './ComponentDialog.scss'
import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import TextField from 'components/TextField'
import { componentStatuses } from 'utils/status'

export const dialogType = {
  add: 1,
  edit: 2
}

class ComponentDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    component: PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    }),
    dialogType: PropTypes.number.isRequired,
    postComponent: PropTypes.func.isRequired,
    updateComponent: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    if (props.component) {
      this.state = {
        name: props.component.name,
        description: props.component.description,
        status: props.component.status
      }
    } else {
      this.state = {
        name: '',
        description: '',
        status: componentStatuses[0]
      }
    }
    this.state.isUpdating = false
    this.state.message = ''
  }

  componentDidMount () {
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

  handleChangeName = (value) => {
    this.setState({name: value})
  }

  handleChangeDescription = (value) => {
    this.setState({description: value})
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
    this.props.postComponent(this.state.name, this.state.description, this.state.status, this.updateCallbacks)
  }

  handleClickEditButton = (e) => {
    this.props.updateComponent(this.props.component.componentID, this.state.name, this.state.description,
      this.state.status, this.updateCallbacks)
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
    this.props.onClosed()
  }

  render () {
    let actionName, clickHandler
    switch (this.props.dialogType) {
      case dialogType.add:
        actionName = 'Add'
        clickHandler = this.handleClickAddButton
        break
      case dialogType.edit:
        actionName = 'Edit'
        clickHandler = this.handleClickEditButton
        break
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }

    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        {actionName} Component
      </h2>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        <TextField label='Name' text={this.state.name} rows={1} onChange={this.handleChangeName} />
        <TextField label='Description (optional)' text={this.state.description} rows={2}
          onChange={this.handleChangeDescription} />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={clickHandler} name={actionName}
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}

export default ComponentDialog
