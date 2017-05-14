import React from 'react'
import { Route, IndexRoute } from 'react-router'
import StatusPageLayout from 'components/statusPage/StatusPageLayout'
import Statuses from 'components/statusPage/Statuses'
import History from 'components/statusPage/History'
import Incident from 'components/statusPage/Incident'
import Maintenance from 'components/statusPage/Maintenance'
import NotFound from 'components/statusPage/NotFound'

const routes = (
  <Route path='/' component={StatusPageLayout}>
    <IndexRoute component={Statuses} />
    <Route path='statuses' component={Statuses} />
    <Route path='history' component={History} />
    <Route path='incidents/:id' component={Incident} />
    <Route path='maintenances/:id' component={Maintenance} />
    <Route path='*' component={NotFound} />
  </Route>
)

export default routes
