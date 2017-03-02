import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import { statusPageURL } from 'utils/settings'
import classes from './Header.scss'

export default class Header extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    fetchUser: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchUser()

    let jsElem = ReactDOM.findDOMNode(this.refs.menu)
    componentHandler.upgradeElement(jsElem)
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
    const userMenu = this.renderUserMenu()
    return (<header className={classnames('mdl-layout__header', 'mdl-layout--no-drawer-button', classes.header)}>
      <div className='mdl-layout__header-row'>
        <span className='mdl-layout-title'>LambStatus Admin</span>
        <div className='mdl-layout-spacer' />
        <nav className='mdl-navigation'>
          <a className={classnames('mdl-button', 'mdl-js-button', classes.nav_item)} href={statusPageURL}>
            View Status Page
          </a>
          {userMenu}
        </nav>
      </div>
    </header>)
  }
}
