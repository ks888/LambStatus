import React, { PropTypes } from 'react'
import classes from './ErrorMessage.scss'

export default class ErrorMessage extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={classes.errorMessage}>
        {this.props.message}
      </div>
    )
  }
}
