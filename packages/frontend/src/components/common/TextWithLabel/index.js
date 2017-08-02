import React, { PropTypes } from 'react'
import classes from './TextWithLabel.scss'

export default class TextWithLabel extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string
  }

  render () {
    return (
      <div className={classes.container}>
        <label className={classes.label}>{this.props.label}</label>
        <div className={classes.text}>
          {this.props.text}
        </div>
      </div>
    )
  }
}
