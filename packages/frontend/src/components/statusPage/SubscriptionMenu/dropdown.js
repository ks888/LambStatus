import React, { PropTypes } from 'react'
import classnames from 'classnames'
import onClickOutside from 'react-onclickoutside'
import classes from './SubscriptionMenu.scss'

class Dropdown extends React.Component {
  static propTypes = {
    onOutsideClicked: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      isUpdating: false,
      succeeded: false,
      message: ''
    }
    this.successfulMessage = 'Thank you! The confirmation email is sent.'
  }

  updateCallbacks = {
    onLoad: () => { this.setState({isUpdating: true, message: ''}) },
    onSuccess: () => { this.setState({isUpdating: false, succeeded: true, message: this.successfulMessage}) },
    onFailure: (msg) => { this.setState({isUpdating: false, succeeded: false, message: msg}) }
  }

  handleClickOutside = (event) => {
    this.props.onOutsideClicked(event)
  }

  handleChangeEmailAddress = (e) => {
    this.setState({email: e.target.value})
  }

  onSubscribeClicked = () => {
    this.props.subscribe(this.state.email, this.updateCallbacks)
  }

  render () {
    let msgClass = (this.state.succeeded ? classes['message-successful'] : classes['message-failure'])
    return (
      <div className={classes['dropdown']}>
        <div>
          Subscribe to incident updates
        </div>
        <div className={msgClass}>
          {this.state.message}
        </div>
        <div className={classes['subscribe-container']}>
          <input className={classes['input']} onChange={this.handleChangeEmailAddress} placeholder='Email Address' />
          <span
            className={classnames(classes['button'], (this.state.isUpdating ? classes['button-disabled'] : undefined))}
            onClick={this.onSubscribeClicked}>
            Subscribe
          </span>
        </div>
      </div>
    )
  }
}

export default onClickOutside(Dropdown)
