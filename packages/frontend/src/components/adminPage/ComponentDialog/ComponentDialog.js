import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import TextField from 'components/common/TextField'
import { mountDialog, unmountDialog } from 'utils/dialog'
import { componentStatuses } from 'utils/status'
import classes from './ComponentDialog.scss'

export const dialogType = {
  add: 1,
  edit: 2
}

export default class ComponentDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    component: PropTypes.shape({
      componentID: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired
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
    mountDialog(ReactDOM.findDOMNode(this.refs.dialog))
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
    this.props.postComponent(this.state, this.updateCallbacks)
  }

  handleClickEditButton = (e) => {
    const params = Object.assign({}, this.props.component, this.state)
    this.props.updateComponent(params, this.updateCallbacks)
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
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
        console.warn('unknown dialog type: ', this.props.dialogType)
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
