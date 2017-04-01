import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import { mountDialog, unmountDialog } from 'utils/dialog'
import classes from './FoolproofDialog.scss'

export default class FoolproofDialog extends React.Component {
  static propTypes = {
    onClosed: PropTypes.func.isRequired,
    deleteFunction: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    ID: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isUpdating: false,
      message: ''
    }
  }

  componentDidMount () {
    mountDialog(ReactDOM.findDOMNode(this.refs.dialog))
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

  handleClickDeleteButton = () => {
    this.props.deleteFunction(this.props.ID, this.updateCallbacks)
  }

  handleHideDialog = () => {
    unmountDialog(ReactDOM.findDOMNode(this.refs.dialog))
    this.props.onClosed()
  }

  render () {
    return (<dialog className={classnames('mdl-dialog', classes.dialog)} ref='dialog'>
      <h4 className={classnames('mdl-dialog__title', classes.title)}>
        Delete <i>{this.props.name}</i> ?
      </h4>
      <div className='mdl-dialog__content'>
        <ErrorMessage message={this.state.message} />
        This operation can not be undone.
      </div>
      <div className='mdl-dialog__actions'>
        <Button onClick={this.handleClickDeleteButton} name='Delete'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
        <Button onClick={this.handleHideDialog} name='Cancel' />
      </div>
    </dialog>)
  }
}
