import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import ReactDOM from 'react-dom'
import classes from './Header.scss'

export default class Header extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    signout: PropTypes.func.isRequired,
    settings: PropTypes.shape({
      statusPageURL: PropTypes.string,
      serviceName: PropTypes.string
    }).isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchSettings: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchUser()

    let jsElem = ReactDOM.findDOMNode(this.refs.menu)
    componentHandler.upgradeElement(jsElem)
  }

  componentWillUpdate (nextProps) {
    if (nextProps.username !== this.props.username) {
      this.props.fetchSettings()
    }

    if (nextProps.settings.serviceName !== this.props.settings.serviceName) {
      document.title = `${nextProps.settings.serviceName} Status Admin (read-only demo)`
    }
  }

  renderUserMenu = () => {
    return (
      <div className={classes['header-menu-item']}>
        <span id='username' className={classes['username']}>
          <span>{this.props.username}</span>
          <i className='material-icons'>keyboard_arrow_down</i>
        </span>

        <ul className='mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect'
          htmlFor='username' ref='menu'>
          <li className='mdl-menu__item mdl-menu__item--full-bleed-divider' onClick={this.props.signout}>Sign out</li>
        </ul>
      </div>
    )
  }

  render () {
    const { settings } = this.props
    const userMenu = this.renderUserMenu()
    return (
      <header className={classes.header}>
        <span className='mdl-layout-title'>
          <Link to='/' className={classes.title}>{settings.serviceName} Status Admin (read-only demo)</Link>
        </span>
        <div className='mdl-layout-spacer' />
        <div className={classes['header-menu']}>
          <div className={classes['header-menu-item']}>
            <a href={settings.statusPageURL} target='_blank'>
              View Status Page
            </a>
          </div>
          {userMenu}
        </div>
      </header>
    )
  }
}
