import React, { PropTypes } from 'react'
import classes from './ErrorMessage.scss'

export const ErrorMessage = (props) => (
  <div className={classes.errorMessage}>
    {props.message}
  </div>
)

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired
}

export default ErrorMessage
