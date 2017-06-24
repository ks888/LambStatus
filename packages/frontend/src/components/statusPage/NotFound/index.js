import React from 'react'
import classnames from 'classnames'
import Link from 'components/common/Link'
import classes from './NotFound.scss'

export default class NotFound extends React.Component {
  render () {
    return (
      <div className={classnames(classes.layout)}>
        <h4>404 page not found</h4>
        <p>We are sorry but the page you are looking for does not exist.</p>
        <Link link='/' text='Current Incidents' />
      </div>
    )
  }
}
