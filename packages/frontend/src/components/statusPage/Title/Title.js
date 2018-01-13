import React, { PropTypes } from 'react'
import classes from './Title.scss'

export const Title = (props) => (
  <h4>
    <span className={classes.service_name}>{props.serviceName}</span>
    <span style={{ color: props.statusColor }}> Status</span>
  </h4>
)

Title.propTypes = {
  serviceName: PropTypes.string,
  statusColor: PropTypes.string
}
export default Title
