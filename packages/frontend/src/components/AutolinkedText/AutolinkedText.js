import React, { PropTypes } from 'react'
import Linkify from 'linkifyjs/react'
import classes from './AutolinkedText.scss'

class AutolinkedText extends React.Component {
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

AutolinkedText.propTypes = {
  text: PropTypes.string.isRequired
}

export default AutolinkedText
