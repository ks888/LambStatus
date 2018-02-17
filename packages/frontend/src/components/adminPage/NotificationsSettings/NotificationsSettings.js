import React, { PropTypes } from 'react'
import ReactTooltip from 'react-tooltip'
import classnames from 'classnames'
import ErrorMessage from 'components/common/ErrorMessage'
import RadioButtonGroup from 'components/common/RadioButtonGroup'
import TextField from 'components/common/TextField'
import LabeledDropdownList from 'components/common/LabeledDropdownList'
import IconButton from 'components/common/IconButton'
import classes from './NotificationsSettings.scss'

const sesRegions = [
  {id: 'us-west-2', name: 'US West (Oregon)'},
  {id: 'us-east-1', name: 'US East (N. Virginia)'},
  {id: 'eu-west-1', name: 'EU (Ireland)'}
]

export default class NotificationsSettings extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      enable: PropTypes.bool,
      sourceRegion: PropTypes.string,
      sourceEmailAddress: PropTypes.string
    }),
    updateSettings: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      sourceRegion: props.settings.sourceRegion || sesRegions[0].id,
      enable: props.settings.enable || false,
      sourceEmailAddress: props.settings.sourceEmailAddress || '',
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

  handleEnableEmailNotification = (value) => {
    this.setState({enable: (value === 'Enable')})
  }

  handleChangeRegion = (value) => {
    const sourceRegion = sesRegions.find(r => r.name === value).id
    this.setState({sourceRegion})
  }

  handleChangeEmailAddress = (value) => {
    this.setState({sourceEmailAddress: value})
  }

  handleClickSaveButton = () => {
    const newSettings = {
      emailNotification: {
        enable: this.state.enable,
        sourceRegion: this.state.sourceRegion,
        sourceEmailAddress: this.state.sourceEmailAddress
      }
    }

    this.props.updateSettings(newSettings, this.callbacks)
  }

  render () {
    const regionName = sesRegions.find(r => r.id === this.state.sourceRegion).name
    let errMsg
    if (this.state.message) {
      errMsg = (<ErrorMessage message={this.state.message} />)
    }

    const linkToDoc = 'https://lambstatus.github.io/set-up-email-notification'

    const enableItemLabel = (
      <span>
        Email Notifications
        <i
          className={classnames(classes.icon, 'material-icons')} data-tip
          data-for='sesRegion'>info_outline</i>
      </span>
    )

    return (
      <div className={classes.layout}>
        {errMsg}
        <RadioButtonGroup
          title={enableItemLabel} candidates={['Enable', 'Disable']} onClicked={this.handleEnableEmailNotification}
          checkedCandidate={(this.state.enable ? 'Enable' : 'Disable')} className={classes.item} />
        <div className={classes.item}>
          <LabeledDropdownList
            id='region' label='Simple Email Service (SES) Region' onChange={this.handleChangeRegion}
            list={sesRegions.map(r => r.name)} initialValue={regionName} />
        </div>
        <TextField
          label='Source Email Address' text={this.state.sourceEmailAddress} rows={1}
          onChange={this.handleChangeEmailAddress} />
        <div className={classes.item}>
          <IconButton
            onClick={this.handleClickSaveButton} iconName='save' name='Save'
            disabled={this.state.isUpdating} />
        </div>
        <ReactTooltip id='sesRegion' effect='solid' place='right' delayHide={5000} className={classes.tooltip}>
          <div>
            Check out
            <a href={linkToDoc} className={classes.link} target='_blank'>
              the documentation
            </a>
            to set up the email notification.
          </div>
        </ReactTooltip>
      </div>
    )
  }
}
