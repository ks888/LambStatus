import React, { PropTypes } from 'react'
import classnames from 'classnames'
import Dropdown from './Dropdown'
import classes from './SubscriptionMenu.scss'

export default class SubscriptionMenu extends React.Component {
  static propTypes = {
    subscribe: PropTypes.func.isRequired,
    emailEnabled: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      opened: false
    }
    this.mailButtonID = 'mail-button'
  }

  clickMailButton = () => {
    this.setState({opened: !this.state.opened})
  }

  onOutsideClicked = (event) => {
    if (document.getElementById(this.mailButtonID).isSameNode(event.target)) {
      // clickMailButton will handle this event. So do nothing here.
      return
    }

    this.setState({opened: false})
  }

  render () {
    let emailIcon
    if (this.props.emailEnabled) {
      emailIcon = (
        <div>
          <i id={this.mailButtonID} className={classnames(classes['mail-icon'], 'material-icons')}
            onClick={this.clickMailButton}>
            mail_outline
          </i>
        </div>
      )
    }

    let dropdown
    if (this.state.opened) {
      dropdown = <Dropdown onOutsideClicked={this.onOutsideClicked} subscribe={this.props.subscribe} />
    }

    return (
      <div className={classes['container']}>
        {dropdown}
        <a href='/history.rss' target='_blank'>
          <i className={classnames(classes['rss-icon'], 'material-icons')}>rss_feed</i>
        </a>
        {emailIcon}
      </div>
    )
  }
}
