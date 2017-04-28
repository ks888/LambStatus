import React, { PropTypes } from 'react'
import classnames from 'classnames'
import TextField from 'components/common/TextField'
import Button from 'settings/common/Button'
import ErrorMessage from 'settings/common/ErrorMessage'
import classes from './Settings.scss'

export default class Settings extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      adminPageURL: PropTypes.string.isRequired,
      statusPageURL: PropTypes.string.isRequired,
      serviceName: PropTypes.string.isRequired
    }).isRequired,
    fetchSettings: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired
  }

  constructor () {
    super()
    this.state = {
      isFetching: false,
      message: '',
      adminPageURL: this.props.settings.adminPageURL,
      statusPageURL: this.props.settings.statusPageURL,
      serviceName: this.props.settings.serviceName
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isUpdating: true}) },
    onSuccess: () => { this.setState({isUpdating: false}) },
    onFailure: (msg) => {
      this.setState({isUpdating: false, message: msg})
    }
  }

  componentDidMount () {
    this.props.fetchSettings(this.callbacks)
  }

  handleChangeValue = (key) => {
    return (value) => {
      this.setState({key: value})
    }
  }

  handleClickSaveButton = () => {
    this.props.updateSettings(this.state.serviceName, this.state.adminPageURL, this.state.statusPageURL,
                              this.callbacks)
  }

  render () {
    const settingItems = Object.keys(this.props.settings).map(key => {
      return (
        <TextField label={key} text={this.state.settings[key]} rows={1} onChange={this.handleChangeValue(key)} />
      )
    })

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className='mdl-cell mdl-cell--12-col mdl-cell--middle'>
          <h4>Settings</h4>
        </div>
        <div className='mdl-cell mdl-cell--12-col mdl-list'>
          <ErrorMessage message={this.state.message} />
        </div>
        <ul className='mdl-cell mdl-cell--12-col mdl-list'>
          {settingItems}
        </ul>
        <Button onClick={this.handleClickSaveButton} name='Save'
          class='mdl-button--accent' disabled={this.state.isUpdating} />
      </div>
    )
  }
}
