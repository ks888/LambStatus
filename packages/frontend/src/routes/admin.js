import React from 'react'
import { Route, IndexRoute } from 'react-router'
import AdminPageLayout from 'components/AdminPageLayout'
import Components from 'containers/Components'
import Incidents from 'containers/Incidents'
import Users from 'components/Users'
import Metrics from 'containers/Metrics'
import Signin from 'containers/Signin'
import { isAuthorized } from 'actions/users'

function requireAuth (nextState, replace) {
  isAuthorized(authorized => {
    if (!authorized) {
      replace({ pathname: '/signin' })
    }
  })
}

function guestOnly (nextState, replace) {
  isAuthorized(authorized => {
    if (authorized) {
      replace({ pathname: '/' })
    }
  })
}

const routes = (
  <Route path='/' component={AdminPageLayout}>
    <IndexRoute component={Components} onEnter={requireAuth} />
    <Route path='components' component={Components} onEnter={requireAuth} />
    <Route path='incidents' component={Incidents} onEnter={requireAuth} />
    <Route path='users' component={Users} onEnter={requireAuth} />
    <Route path='metrics' component={Metrics} onEnter={requireAuth} />
    <Route path='signin' component={Signin} onEnter={guestOnly} />
  </Route>
)

export default routes
