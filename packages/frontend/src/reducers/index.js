import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'
import componentReducer from 'reducers/components'
import incidentReducer from 'reducers/incidents'

const rootReducer = combineReducers({
  components: componentReducer,
  incidents: incidentReducer,
  router
})

export default rootReducer
