import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'
import componentReducer from 'reducers/components'
import incidentReducer from 'reducers/incidents'
import statusesReducer from 'reducers/statuses'
import historyReducer from 'reducers/history'

const rootReducer = combineReducers({
  components: componentReducer,
  incidents: incidentReducer,
  statuses: statusesReducer,
  history: historyReducer,
  router
})

export default rootReducer
