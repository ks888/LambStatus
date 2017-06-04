import React, { PropTypes } from 'react'
import classnames from 'classnames'
import classes from './Spinner.scss'

// based on SpinKit http://tobiasahlin.com/spinkit/
export default class Spinner extends React.Component {
  static propTypes = {
    class: PropTypes.string,
    enable: PropTypes.bool
  }

  render () {
    if (!this.props.enable) {
      return null
    }

    return (
      <div className={classnames(this.props.class, classes['sk-fading-circle'])}>
        <div className={classnames(classes['sk-circle1'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle2'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle3'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle4'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle5'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle6'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle7'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle8'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle9'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle10'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle11'], classes['sk-circle'])} />
        <div className={classnames(classes['sk-circle12'], classes['sk-circle'])} />
      </div>
    )
  }
}
