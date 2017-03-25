import React, { PropTypes } from 'react'
import Linkify from 'linkifyjs/react'
import classes from './AutolinkedText.scss'

export default class AutolinkedText extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  }

  render () {
    const options = {
      attributes: {
        rel: 'nofollow'
      },
      className: classes.link
    }
    return (
      <Linkify tagName='span' options={options}>{this.props.text}</Linkify>
    )
  }
}
