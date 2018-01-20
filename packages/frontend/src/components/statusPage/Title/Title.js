import React, { PropTypes } from 'react'
import classes from './Title.scss'

export default class Title extends React.Component {
  static propTypes = {
    serviceName: PropTypes.string,
    logoID: PropTypes.string,
    statusColor: PropTypes.string
  }

  render () {
    let title = (<div />)
    if (this.props.logoID !== undefined && this.props.logoID !== '') {
      const defaultLogoURL = `/${this.props.logoID}`
      const retinaLogoURL = `${defaultLogoURL}@2x`
      title = (
        <img className={classes.logo} src={defaultLogoURL} srcSet={`${defaultLogoURL} 1x, ${retinaLogoURL} 2x`} />
      )
    } else if (this.props.serviceName !== undefined && this.props.serviceName !== '') {
      title = (
        <h4 className={classes.title}>
          <span>{this.props.serviceName}</span>
          <span style={{ color: this.props.statusColor }}> Status</span>
        </h4>
      )
    }
    return title
  }
}
