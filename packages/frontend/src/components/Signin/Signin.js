import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/Button'
import TextField from 'components/TextField'
import classes from './Signin.scss'

const dialogType = {
  signin: 1,
  setNewPassword: 2
}

export default class Signin extends React.Component {
  static propTypes = {
    signin: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.signin,
      username: '',
      password: '',
      isUpdating: false,
      newPasswordCallback: null
    }
  }

  componentDidMount () {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog && !dialog.showModal) {
      console.log('dialog')
      // dialog polyfill has a limitation that the dialog should have a child of parents without parents.
      // Here is a workaround for this limitation.
      document.getElementById('dialog-container').appendChild(dialog)

      dialogPolyfill.registerDialog(dialog)
      dialog.showModal()
    }
  }

  handleChangeUsername = (value) => {
    this.setState({username: value})
  }

  handleChangePassword = (value) => {
    this.setState({password: value})
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

  handleClickSigninButton = (e) => {
    this.props.signin(this.state.username, this.state.password, {
      ...this.updateCallbacks,
      onNewPasswordRequested: (callback) => {
        this.setState({
          isUpdating: false,
          password: '',
          dialogType: dialogType.setNewPassword,
          newPasswordCallback: callback
        })
      }
    })
  }

  handleSetNewPasswordButton = (e) => {
    const { password, newPasswordCallback } = this.state
    if (newPasswordCallback && typeof newPasswordCallback === 'function') {
      newPasswordCallback(password, this.updateCallbacks)
    } else {
      console.warn('States do not include newPasswordCallback')
    }
  }

  handleHideDialog = () => {
    const dialog = ReactDOM.findDOMNode(this.refs.dialog)
    if (dialog) {
      dialog.close()
      document.getElementById('inner-dialog-container').appendChild(dialog)
    }
  }

  renderSigninDialog = () => {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Signin
      </h2>
      <div className='mdl-dialog__content'>
        <TextField label='Username' text={this.state.username} rows={1} onChange={this.handleChangeUsername} />
        <TextField label='Password' text={this.state.password} rows={1} onChange={this.handleChangePassword} />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickSigninButton} name='Signin'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
      </div>
    </dialog>)
  }

  renderNewPasswordDialog = () => {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Signin
      </h2>
      <div className='mdl-dialog__content'>
        <TextField label='New Password' text={this.state.password} rows={1} onChange={this.handleChangePassword} />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleSetNewPasswordButton} name='DONE'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
      </div>
    </dialog>)
  }

  renderDialog = () => {
    switch (this.state.dialogType) {
      case dialogType.signin:
        return this.renderSigninDialog()
      case dialogType.setNewPassword:
        return this.renderNewPasswordDialog()
      default:
        console.warn('unknown dialog type: ', this.state.dialogType)
    }
  }

  render () {
    const dialog = this.renderDialog()
    return (<div id='inner-dialog-container'>
      {dialog}
    </div>)
  }
}
