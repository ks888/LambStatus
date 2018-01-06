import React, { PropTypes } from 'react'
import classes from './StatusPageLayout.scss'

export default class StatusPageLayout extends React.Component {
  static propTypes = {
    settings: PropTypes.shape({
      serviceName: PropTypes.string
    }).isRequired,
    fetchSettings: PropTypes.func.isRequired,
    children: React.PropTypes.element.isRequired
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
    return (
      <main className={classes.main}>
        {this.props.children}
      </main>
    )
  }
}
