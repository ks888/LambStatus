import React, { PropTypes } from 'react'

export default class Header extends React.Component {
  static propTypes = {
    fetchSettings: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchSettings()
  }

  render () {
    return null
  }
}
