import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { statusPageURL } from 'utils/settings'
import classes from './Header.scss'

export default class Header extends React.Component {
  static propTypes = {
    username: PropTypes.string,
    fetchUser: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchUser()
  }

  render () {
    return (<header className={classnames('mdl-layout__header', 'mdl-layout--no-drawer-button', classes.header)}>
      <div className='mdl-layout__header-row'>
        <span className='mdl-layout-title'>LambStatus</span>
        <div className='mdl-layout-spacer' />
        <nav className='mdl-navigation'>
          <a className='mdl-navigation__link' href={'https://' + statusPageURL}>View Status Page</a>
          <div className='mdl-navigation__link' href={'https://' + statusPageURL}>
            {this.props.username}
            <i className='material-icons'>keyboard_arrow_down</i>
          </div>
        </nav>
      </div>
    </header>)
  }
}
