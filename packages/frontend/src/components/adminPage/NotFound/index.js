import React from 'react'
import classnames from 'classnames'
import classes from './NotFound.scss'

export default class NotFound extends React.Component {
  render () {
    return (
      <div className={classnames(classes.layout)}>
        <h4>404 page not found</h4>
      </div>
    )
  }
}
