import React, { PropTypes } from 'react'

export default class Header extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      serviceName: PropTypes.string
    }).isRequired,
    fetchSettings: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchSettings()
  }

  componentWillUpdate (nextProps) {
    if (nextProps.settings.serviceName) {
      document.title = `${nextProps.settings.serviceName} Status`
    }
  }

  render () {
    return null
  }
}
