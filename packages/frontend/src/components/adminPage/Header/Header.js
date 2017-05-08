import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
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
    this.props.fetchSettings()

    let jsElem = ReactDOM.findDOMNode(this.refs.menu)
    componentHandler.upgradeElement(jsElem)
  }

  componentWillUpdate (nextProps) {
    if (nextProps.username !== this.props.username) {
      this.props.fetchSettings()
    }

    if (nextProps.settings.serviceName !== this.props.settings.serviceName) {
      document.title = `${nextProps.settings.serviceName}Status Admin`
    }
  }

  renderUserMenu = () => {
    return (
      <div>
        <button id='header-user-menu'
          className={classnames('mdl-button', 'mdl-js-button', classes.nav_item)}>
          {this.props.username}
          <i className='material-icons'>keyboard_arrow_down</i>
        </button>

        <ul className='mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect'
          htmlFor='header-user-menu' ref='menu'>
          <li className='mdl-menu__item mdl-menu__item--full-bleed-divider' onClick={this.props.signout}>Sign out</li>
        </ul>
      </div>
    )
  }

  render () {
    const { settings } = this.props
    const userMenu = this.renderUserMenu()
    return (
      <header className={classnames('mdl-layout__header', 'mdl-layout--no-drawer-button', classes.header)}>
        <div className='mdl-layout__header-row'>
          <span className='mdl-layout-title'>
            <Link to='/' className={classes.title}>{settings.serviceName}Status Admin</Link>
          </span>
          <div className='mdl-layout-spacer' />
          <nav className='mdl-navigation'>
            <a className={classnames('mdl-button', 'mdl-js-button', classes.nav_item)} href={settings.statusPageURL}>
              View Status Page
            </a>
            {userMenu}
          </nav>
        </div>
      </header>
    )
  }
}
