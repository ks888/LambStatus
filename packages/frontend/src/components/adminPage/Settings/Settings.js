import React, { PropTypes } from 'react'
import classnames from 'classnames'
import TextField from 'components/common/TextField'
import Button from 'components/common/Button'
import ErrorMessage from 'components/common/ErrorMessage'
import ApiKeysSelector, { apiKeyStatuses } from 'components/adminPage/ApiKeysSelector'
import classes from './Settings.scss'

export default class Settings extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      adminPageURL: PropTypes.string,
      statusPageURL: PropTypes.string,
      serviceName: PropTypes.string,
      apiKeys: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      }))
    }).isRequired,
    fetchSettings: PropTypes.func.isRequired,
    updateSettings: PropTypes.func.isRequired,
    addApiKey: PropTypes.func.isRequired,
    deleteApiKey: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isFetching: false,
      message: '',
      adminPageURL: props.settings.adminPageURL || '',
      statusPageURL: props.settings.statusPageURL || '',
      serviceName: props.settings.serviceName || '',
      apiKeys: props.settings.apiKeys ? props.settings.apiKeys.map(key => {
        return { ...key, status: apiKeyStatuses.created }
      }) : []
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isFetching: true}) },
    onSuccess: () => { this.setState({isFetching: false, message: ''}) },
    onFailure: (msg) => {
      this.setState({isFetching: false, message: msg})
    }
  }

  componentDidMount () {
    this.props.fetchSettings(this.callbacks)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      adminPageURL: nextProps.settings.adminPageURL,
      statusPageURL: nextProps.settings.statusPageURL,
      serviceName: nextProps.settings.serviceName,
      apiKeys: nextProps.settings.apiKeys.map(key => {
        return { ...key, status: apiKeyStatuses.created }
      })
    })
  }

  handleApiKeyAdd = () => {
    this.setState({
      apiKeys: this.state.apiKeys.concat({id: new Date().toISOString(), status: apiKeyStatuses.toBeCreated})
    })
  }

  handleApiKeyDelete = (id) => {
    const newKeys = []
    this.state.apiKeys.forEach(key => {
      if (key.id !== id) { newKeys.push(key); return }

      switch (key.status) {
        case apiKeyStatuses.toBeCreated:
          break
        default:
          newKeys.push({ ...key, status: apiKeyStatuses.toBeDeleted })
      }
    })
    this.setState({ apiKeys: newKeys })
  }

  handleChangeValue = (key) => {
    return (value) => {
      this.setState({[key]: value})
    }
  }

  handleClickSaveButton = () => {
    this.props.updateSettings(this.state.serviceName, this.state.adminPageURL, this.state.statusPageURL,
                              this.callbacks)
    this.state.apiKeys.forEach(key => {
      switch (key.status) {
        case apiKeyStatuses.toBeCreated:
          this.props.addApiKey()
          break
        case apiKeyStatuses.created:
          break
        case apiKeyStatuses.toBeDeleted:
          this.props.deleteApiKey(key.id)
          break
        default:
          throw new Error('unknown status', key.status)
      }
    })
  }

  renderApiKeysSelector = () => {
    return (
      <ul key='apiKeys' className={classnames(classes.item, 'mdl-cell', 'mdl-cell--7-col', 'mdl-list')}>
        <ApiKeysSelector apiKeys={this.state.apiKeys} onAdd={this.handleApiKeyAdd} onDelete={this.handleApiKeyDelete} />
      </ul>
    )
  }

  renderItem = (setting) => {
    const { key, info } = setting
    const text = key.charAt(0).toUpperCase() + key.slice(1)
    return (
      <ul key={key} className={classnames(classes.item, 'mdl-cell', 'mdl-cell--7-col', 'mdl-list')}>
        <TextField label={text} text={this.state[key]} rows={1} onChange={this.handleChangeValue(key)}
          information={info} />
      </ul>
    )
  }

  render () {
    // eslint-disable-next-line
    const urlSettingInfo = 'Affects the links in email notifications, RSS feeds, and so on. It doesn\'t change your DNS setting.'
    const settings = [
      {key: 'serviceName'},
      {key: 'statusPageURL', info: urlSettingInfo},
      {key: 'adminPageURL', info: urlSettingInfo}
    ]
    const settingItems = settings.map(this.renderItem)
    settingItems.push(this.renderApiKeysSelector())

    let errMsg
    if (this.state.message) {
      errMsg = (
        <div className='mdl-cell mdl-cell--12-col mdl-cell--middle'>
          <ErrorMessage message={this.state.message} />
        </div>
      )
    }

    return (
      <div className={classnames(classes.layout, 'mdl-grid')}
        style={{ opacity: this.state.isFetching ? 0.5 : 1 }}>
        <div className='mdl-cell mdl-cell--12-col mdl-cell--middle'>
          <h4>Settings</h4>
        </div>
        {errMsg}
        {settingItems}
        <div className='mdl-cell mdl-cell--6-col mdl-cell--middle' />
        <div className='mdl-cell mdl-cell--1-col'>
          <Button onClick={this.handleClickSaveButton} name='Save'
            class='mdl-button--accent' disabled={this.state.isFetching} />
        </div>
      </div>
    )
  }
}
