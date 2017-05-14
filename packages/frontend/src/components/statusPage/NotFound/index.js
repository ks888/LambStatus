import React from 'react'
import classnames from 'classnames'
import ModestLink from 'components/common/ModestLink'
import classes from './NotFound.scss'

export default class NotFound extends React.Component {
  render () {
    return (
      <div className={classnames(classes.layout)}>
        <h4>404 page not found</h4>
        <p>We are sorry but the page you are looking for does not exist.</p>
        <ModestLink link='/' text='Current Incidents' />
      </div>
    )
  }
}
