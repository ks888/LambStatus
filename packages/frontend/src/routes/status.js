import React from 'react'
import { Route, IndexRoute } from 'react-router'
import StatusPageLayout from 'components/StatusPageLayout'
import Statuses from 'containers/Statuses'
import History from 'containers/History'

const routes = (
  <Route path='/' component={StatusPageLayout}>
    <IndexRoute component={Statuses} />
    <Route path='statuses' component={Statuses} />
    <Route path='history' component={History} />
  </Route>
)

export default routes
