import React from 'react'
import LogoUploader from 'components/adminPage/LogoUploader'
import classes from './DesignSettings.scss'

export default class DesignSettings extends React.Component {
  render () {
    return (
      <div className={classes.layout}>
        <LogoUploader />
      </div>
    )
  }
}
