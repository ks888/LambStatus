import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router'
import classes from './ModestLink.scss'

export const ModestLink = (props) => (
  <div className={classes.block}>
    <Link to={props.link} className={classes.link}>
      <i className={classnames('material-icons', classes.link_icon)}>chevron_right</i> {props.text}
    </Link>
  </div>
)

ModestLink.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default ModestLink
