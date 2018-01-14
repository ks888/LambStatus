import React, { PropTypes } from 'react'

export const Title = (props) => (
  <h4>
    <span>{props.serviceName}</span>
    <span style={{ color: props.statusColor }}> Status</span>
  </h4>
)

Title.propTypes = {
  serviceName: PropTypes.string,
  statusColor: PropTypes.string
}
export default Title
