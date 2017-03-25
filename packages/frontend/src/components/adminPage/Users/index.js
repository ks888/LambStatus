import React from 'react'
import classnames from 'classnames'
import classes from './Users.scss'
import { userPoolId } from 'utils/settings'

export default class Users extends React.Component {
  render () {
    const region = userPoolId.match(/^[a-z0-9-]+/)
    if (!region) {
      console.warn('user pool id has unexpected format:', region)
    }
    const linkToUsersPage = `https://${region}.console.aws.amazon.com/cognito/users?region=${region}#/pool/${userPoolId}/users`
    return (<div className={classnames(classes.layout, 'mdl-grid')}>
      <div className='mdl-cell mdl-cell--12-col'>
        <h4>Users</h4>
      </div>
      <div className='mdl-cell mdl-cell--12-col'>
        Operations like creating a user are not supported here. Access
        <a href={linkToUsersPage} className={classes.link}>
          Users page at Amazon Cognito
        </a>
        for these operations.
      </div>
    </div>)
  }
}
