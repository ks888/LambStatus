import React, { PropTypes } from 'react'
import classes from './Title.scss'

export const Title = (props) => (
  <h4>
    <span className={classes.service_name}>{props.service_name}</span>
    <span className={classes.status}>Status</span>
  </h4>
)

Title.propTypes = {
  service_name: PropTypes.string
}
export default Title
