import React, { PropTypes } from 'react'
import IconButton from 'components/common/IconButton'
import classes from './LogoUploader.scss'

export default class LogoUploader extends React.Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    logoID: PropTypes.string,
    uploadLogo: PropTypes.func.isRequired
  }

  handleClickUploadButton = () => {
    this.fileSelector.click()
  }

  upload = (input) => {
    this.props.uploadLogo(input.target.files[0])
  }

  render () {
    let image
    let deleteIcon
    if (this.props.logoID !== undefined) {
      image = ''
      deleteIcon = <IconButton onClick={this.props.onAdd} iconName='delete' name='Delete' />
    } else {
      image = (<span className={classes['no-logo']} />)
      deleteIcon = <IconButton onClick={this.props.onAdd} iconName='delete' name='Delete' disabled />
    }

    /* eslint-disable react/jsx-no-bind */  // refs callback
    return (
      <div className={classes.container}>
        <label className={classes.label}>Logo Image</label>
        {image}
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
