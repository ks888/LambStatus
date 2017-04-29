import React from 'react'
import { Route, IndexRoute } from 'react-router'

import AdminPageLayout from 'components/adminPage/AdminPageLayout'
import Components from 'components/adminPage/Components'
import Incidents from 'components/adminPage/Incidents'
import Maintenances from 'components/adminPage/Maintenances'
import Users from 'components/adminPage/Users'
import Metrics from 'components/adminPage/Metrics'
import Settings from 'components/adminPage/Settings'
import Signin from 'components/adminPage/Signin'
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
    <Route path='maintenances' component={Maintenances} onEnter={requireAuth} />
    <Route path='users' component={Users} onEnter={requireAuth} />
    <Route path='metrics' component={Metrics} onEnter={requireAuth} />
    <Route path='settings' component={Settings} onEnter={requireAuth} />
    <Route path='signin' component={Signin} onEnter={guestOnly} />
  </Route>
)

export default routes
