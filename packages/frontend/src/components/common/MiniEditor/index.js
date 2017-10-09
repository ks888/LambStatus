import React, { PropTypes } from 'react'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import TextField from 'components/common/TextField'
import classes from './MiniEditor.scss'

export default class MiniEditor extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    initialText: PropTypes.string,
    errorMessage: PropTypes.string,
    isUpdating: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      message: props.initialText,
      isUpdating: false
    }
  }

  handleChangeMessage = (value) => {
    this.setState({message: value})
  }

  save = () => {
    this.props.onSave(this.state.message)
  }

  render () {
    return (
      <div>
        <ErrorMessage message={this.props.errorMessage} />
        <TextField text={this.state.message} rows={1} onChange={this.handleChangeMessage} />
        <div className={classes['message-bottons']}>
          <Button onClick={this.props.onCancel} name='Cancel' />
          <Button onClick={this.save} name='Save'
            class='mdl-button--accent' disabled={this.props.isUpdating} />
        </div>
      </div>
    )
  }
}
