import React, { PropTypes } from 'react'
import classes from './Title.scss'

export default class Title extends React.Component {
  static propTypes = {
    serviceName: PropTypes.string,
    logoID: PropTypes.string,
    statusColor: PropTypes.string
  }

  render () {
    if (this.props.logoID !== undefined && this.props.logoID !== '') {
      const defaultLogoURL = `/${this.props.logoID}`
      const retinaLogoURL = `${defaultLogoURL}@2x`
      return (
        <img className={classes.logo} src={defaultLogoURL} srcSet={`${defaultLogoURL} 1x, ${retinaLogoURL} 2x`} />
      )
    } else {
      return (
        <h4 className={classes.title}>
          <span>{this.props.serviceName}</span>
          <span style={{ color: this.props.statusColor }}> Status</span>
        </h4>
      )
    }
  }
}
