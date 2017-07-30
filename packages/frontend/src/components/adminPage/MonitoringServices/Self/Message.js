import React, { PropTypes } from 'react'
import classes from './Self.scss'

export default class Message extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      apiKeys: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired
      }).isRequired).isRequired
    }),
    apiHostname: PropTypes.string.isRequired,
    metricID: PropTypes.string.isRequired,
    fetchSettings: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchSettings()
  }

  render () {
    const hostname = encodeURIComponent(this.props.apiHostname.replace('https://', '').replace('/prod/', ''))
    let linkToScript = `/metrics/${this.props.metricID}/scripts/python?hostname=${hostname}`
    if (this.props.settings !== undefined && this.props.settings.apiKeys.length > 0) {
      const apiKey = encodeURIComponent(this.props.settings.apiKeys[0].value)
      linkToScript += `&apiKey=${apiKey}`
    }

    return (
      <div>
        Note: this metric is "Self" type, and so submit data points by yourself. Use
        <a href={linkToScript} className={classes.link} target='_blank'>this Python script</a>
        as the starting point.
      </div>
    )
  }
}
