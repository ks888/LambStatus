import React, { PropTypes } from 'react'
import ErrorMessage from 'components/common/ErrorMessage'
import IconButton from 'components/common/IconButton'
import classes from './ColorSettings.scss'

export default class ColorSettings extends React.Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    updateSettings: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      backgroundColor: this.props.backgroundColor || '#FFFFFF',
      isUpdating: false,
      message: ''
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isUpdating: true, message: ''}) },
    onSuccess: () => { this.setState({isUpdating: false, message: ''}) },
    onFailure: (msg) => {
      this.setState({isUpdating: false, message: msg})
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ backgroundColor: nextProps.backgroundColor })
  }

  handleChange = (e) => {
    this.setState({backgroundColor: e.target.value})
  }

  handleClickSaveButton = () => {
    this.props.updateSettings({backgroundColor: this.state.backgroundColor}, this.callbacks)
  }

  render () {
    let errMsg
    if (this.state.message) {
      errMsg = (<ErrorMessage message={this.state.message} />)
    }

    return (
      <div className={classes.setting} >
        <label className={classes.label} htmlFor='background-color'>Background Color</label>
        {errMsg}
        <span className={classes.item} >
          <input className={classes.selector} id='background-color' value={this.state.backgroundColor}
            onChange={this.handleChange} />
          <div className={classes.colorbox} style={{backgroundColor: this.state.backgroundColor}} />
        </span>
        <IconButton onClick={this.handleClickSaveButton} iconName='save' name='Save' disabled={this.state.isUpdating} />
      </div>
    )
  }
}
