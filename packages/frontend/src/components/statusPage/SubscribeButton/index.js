import React from 'react'
import classnames from 'classnames'
import classes from './SubscribeButton.scss'

export default class SubscribeButton extends React.Component {
  render () {
    return (
      <a href='history.rss'>
        <i className={classnames(classes['rss-icon'], 'material-icons')}>rss_feed</i>
      </a>
    )
  }
}
