import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/Button'
import ErrorMessage from 'components/ErrorMessage'
import TextField from 'components/TextField'
import classes from './Signin.scss'

const dialogType = {
  signin: 1,
  setNewPassword: 2,
  forgotPassword: 3,
  setCode: 4
}

export default class Signin extends React.Component {
  static propTypes = {
    signin: PropTypes.func.isRequired,
    forgotPassword: PropTypes.func.isRequired,
    setCodeAndPassword: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      dialogType: dialogType.signin,
      username: '',
      password: '',
      code: '',
      isUpdating: false,
      message: '',
      newPasswordCallback: null
    }
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

  handleChangeUsername = (value) => {
    this.setState({username: value})
  }

  handleChangePassword = (value) => {
    this.setState({password: value})
  }

  handleChangeCode = (value) => {
    this.setState({code: value})
  }

  updateCallbacks = {
    onLoad: () => { this.setState({isUpdating: true, message: ''}) },
    onSuccess: () => {
      this.setState({isUpdating: false, message: ''})
      this.handleHideDialog()
    },
    onFailure: (msg) => {
      this.setState({isUpdating: false, message: msg})
    }
  }

  showSignInDialog = (e) => {
    this.setState({
      isUpdating: false,
      message: '',
      dialogType: dialogType.signin
    })
  }

  handleClickSigninButton = (e) => {
    this.props.signin(this.state.username, this.state.password, {
      ...this.updateCallbacks,
      onNewPasswordRequested: (callback) => {
        this.setState({
          isUpdating: false,
          message: '',
          password: '',
          dialogType: dialogType.setNewPassword,
          newPasswordCallback: callback
        })
      }
    })
  }

  handleClickForgotButton = (e) => {
    this.setState({
      isUpdating: false,
      message: '',
      dialogType: dialogType.forgotPassword,
      password: ''
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

  handleClickSendCodeButton = (e) => {
    this.props.forgotPassword(this.state.username, {
      ...this.updateCallbacks,
      onSuccess: () => {
        this.setState({
          isUpdating: false,
          message: '',
          dialogType: dialogType.setCode
        })
      }
    })
  }

  handleClickSetCodeButton = (e) => {
    this.props.setCodeAndPassword(this.state.code, this.state.username, this.state.password, {
      ...this.updateCallbacks,
      onSuccess: () => {
        this.setState({
          isUpdating: false,
          message: 'Set new password successfully!',
          dialogType: dialogType.signin,
          password: ''
        })
      }
    })
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
        Sign in
      </h2>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        <TextField label='Email Address' text={this.state.username} rows={1} onChange={this.handleChangeUsername} />
        <TextField label='Password' text={this.state.password} rows={1}
          onChange={this.handleChangePassword} hideText />
        <div className={classes.forgotPassword} onClick={this.handleClickForgotButton}>
          Forgot Password?
        </div>
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
        Sign in
      </h2>
      <div className='mdl-dialog__content'>
        <div>
          Login successful. Now, set your own password.
        </div>
        <ErrorMessage message={this.state.message} />
        <TextField label='New Password' text={this.state.password} rows={1}
          onChange={this.handleChangePassword} hideText />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleSetNewPasswordButton} name='DONE'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
      </div>
    </dialog>)
  }

  renderForgotPasswordDialog = () => {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Forgot Password?
      </h2>
      <div className='mdl-dialog__content'>
        <div>
          Enter your email address. A verification code will be sent to the address.
        </div>
        <ErrorMessage message={this.state.message} />
        <TextField label='Email Address' text={this.state.username} rows={1} onChange={this.handleChangeUsername} />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickSendCodeButton} name='Send verification code'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.showSignInDialog} name='Cancel' />
      </div>
    </dialog>)
  }

  renderSetCodeDialog = () => {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Set New Password
      </h2>
      <div className='mdl-dialog__content'>
        <div>
          Email has been sent to your address. Enter the verification code in the email and set new password.
        </div>
        <ErrorMessage message={this.state.message} />
        <TextField label='Verification code' text={this.state.code} rows={1} onChange={this.handleChangeCode} />
        <TextField label='Password' text={this.state.password} rows={1}
          onChange={this.handleChangePassword} hideText />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickSetCodeButton} name='Done'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.showSignInDialog} name='Cancel' />
      </div>
    </dialog>)
  }

  renderDialog = () => {
    switch (this.state.dialogType) {
      case dialogType.signin:
        return this.renderSigninDialog()
      case dialogType.setNewPassword:
        return this.renderNewPasswordDialog()
      case dialogType.forgotPassword:
        return this.renderForgotPasswordDialog()
      case dialogType.setCode:
        return this.renderSetCodeDialog()
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
