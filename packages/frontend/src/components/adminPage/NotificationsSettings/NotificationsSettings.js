import React, { PropTypes } from 'react'
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
      enableEmailNotification: PropTypes.bool,
      sesRegion: PropTypes.string,
      emailAddress: PropTypes.string
    }),
    updateSettings: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      regionID: props.settings.sesRegion || sesRegions[0].id,
      enableEmailNotification: props.settings.enableEmailNotification || false,
      emailAddress: props.settings.emailAddress || '',
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
    this.setState({enableEmailNotification: (value === 'Enable')})
  }

  handleChangeRegion = (value) => {
    const regionID = sesRegions.find(r => r.name === value).id
    this.setState({regionID})
  }

  handleChangeEmailAddress = (value) => {
    this.setState({emailAddress: value})
  }

  handleClickSaveButton = () => {
    const newSettings = {
      enableEmailNotification: this.state.enableEmailNotification,
      sesRegion: this.state.regionID,
      emailAddress: this.state.emailAddress
    }
    this.props.updateSettings(newSettings, this.callbacks)
  }

  render () {
    const regionName = sesRegions.find(r => r.id === this.state.regionID).name
    return (
      <div className={classes.layout}>
        <RadioButtonGroup
          title='Email Notifications' candidates={['Enable', 'Disable']} onClicked={this.handleEnableEmailNotification}
          checkedCandidate={(this.state.enableEmailNotification ? 'Enable' : 'Disable')} className={classes.item} />
        <div className={classes.item}>
          <LabeledDropdownList
            id='region' label='Simple Email Service (SES) Region' onChange={this.handleChangeRegion}
            list={sesRegions.map(r => r.name)} initialValue={regionName} />
        </div>
        <TextField
          label='Source Email Address' text={this.state.emailAddress} rows={1}
          onChange={this.handleChangeEmailAddress} />
        <div className={classes.item}>
          <IconButton
            onClick={this.handleClickSaveButton} iconName='save' name='Save'
            disabled={this.state.isUpdating} />
        </div>
      </div>
    )
  }
}
