import React from 'react'
import classnames from 'classnames'
import classes from './Header.scss'

export const Header = (props) => (
  <header className={classnames('mdl-layout__header', 'mdl-layout--no-drawer-button', classes.header)}>
    <div className='mdl-layout__header-row'>
      <span className='mdl-layout-title'>LambStatus</span>
      <div className='mdl-layout-spacer' />
      <nav className='mdl-navigation mdl-layout--large-screen-only'>
        <a className='mdl-navigation__link' href=''>View Status Page</a>
      </nav>
    </div>
  </header>
)

export default Header
