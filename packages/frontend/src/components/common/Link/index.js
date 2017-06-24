import React, { PropTypes } from 'react'
import classnames from 'classnames'
import { Link as ReactRouterLink } from 'react-router'
import classes from './Link.scss'

export default class Link extends React.Component {
  static propTypes = {
    link: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }

  render () {
    return (
      <div className={classes.block}>
        <ReactRouterLink to={this.props.link} className={classes.link}>
          <i className={classnames('material-icons', classes.link_icon)}>chevron_right</i> {this.props.text}
        </ReactRouterLink>
      </div>
    )
  }
}

