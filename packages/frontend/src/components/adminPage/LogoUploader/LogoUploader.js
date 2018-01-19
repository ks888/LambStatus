import React, { PropTypes } from 'react'
import ErrorMessage from 'components/common/ErrorMessage'
import IconButton from 'components/common/IconButton'
import Spinner from 'components/common/Spinner'
import classes from './LogoUploader.scss'

export default class LogoUploader extends React.Component {
  static propTypes = {
    logoID: PropTypes.string,
    statusPageURL: PropTypes.string,
    uploadLogo: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isUploading: false,
      message: ''
    }
  }

  callbacks = {
    onLoad: () => { this.setState({isUploading: true}) },
    onSuccess: () => { this.setState({isUploading: false, message: ''}) },
    onFailure: (msg) => {
      this.setState({isUploading: false, message: msg})
    }
  }

  handleClickUploadButton = () => {
    this.fileSelector.click()
  }

  upload = (input) => {
    this.props.uploadLogo(input.target.files[0], this.callbacks)
  }

  getLogo () {
    let logo
    if (this.state.isUploading) {
      logo = (<Spinner />)
    } else if (this.props.logoID !== undefined) {
      const defaultLogoURL = `${this.props.statusPageURL}/${this.props.logoID}`
      const retinaLogoURL = `${defaultLogoURL}@2x`
      logo = (
        <span>
          <img src={defaultLogoURL} srcSet={`${defaultLogoURL} 1x, ${retinaLogoURL} 2x`} alt='Logo' />
        </span>
      )
    } else {
      logo = (<span className={classes['no-logo']} />)
    }
    return logo
  }

  render () {
    const logo = this.getLogo()
    let deleteIcon
    if (this.state.isUploading || this.props.logoID === undefined) {
      deleteIcon = <IconButton onClick='' iconName='delete' name='Delete' disabled />
    } else {
      deleteIcon = <IconButton onClick='' iconName='delete' name='Delete' />
    }

    let errMsg
    if (this.state.message) {
      errMsg = (<ErrorMessage message={this.state.message} />)
    }

    /* eslint-disable react/jsx-no-bind */  // refs callback
    return (
      <div className={classes.container}>
        <label className={classes.label}>Logo Image</label>
        {errMsg}
        {logo}
        <input type='file' ref={input => { this.fileSelector = input }} onChange={this.upload} />
        <div className={classes.icons}>
          <IconButton onClick={this.handleClickUploadButton} iconName='file_upload' name='Upload' />
          {deleteIcon}
        </div>
      </div>
    )
    /* eslint-enable react/jsx-no-bind */
  }
}
