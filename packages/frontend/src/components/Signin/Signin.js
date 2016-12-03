import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/Button'
import TextField from 'components/TextField'
import classes from './Signin.scss'

export default class Signin extends React.Component {
  static propTypes = {
    signin: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      email: '',
      password: '',
      isUpdating: false
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

  handleChangeEmail = (value) => {
    this.setState({email: value})
  }

  handleChangePassword = (value) => {
    this.setState({password: value})
  }

  handleClickDoneButton = (e) => {
    this.props.signin(this.state.email, this.state.password, {
      onLoad: () => { this.setState({isUpdating: true}) },
      onSuccess: () => {
        this.setState({isUpdating: false})
        this.handleHideDialog()
      },
      onFailure: (msg) => {
        this.setState({isUpdating: false, message: msg})
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

  renderDialog = () => {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h2 className={classnames('mdl-dialog__title', classes.title)}>
        Signin
      </h2>
      <div className='mdl-dialog__content'>
        <TextField label='Email' text={this.state.email} rows={1} onChange={this.handleChangeEmail} />
        <TextField label='Password' text={this.state.password} rows={1} onChange={this.handleChangePassword} />
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickDoneButton} name='Signin'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
      </div>
    </dialog>)
  }

  render () {
    const dialog = this.renderDialog()
    return (<div id='inner-dialog-container'>
      {dialog}
    </div>)
  }
}
