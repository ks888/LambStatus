import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router'
import classes from './ModestLink.scss'

export default class ModestLink extends React.Component {
  static propTypes = {
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={classes.block}>
        <Link to={this.props.link} className={classes.link}>
          <i className={classnames('material-icons', classes.link_icon)}>chevron_right</i> {this.props.text}
        </Link>
      </div>
    )
  }
}

