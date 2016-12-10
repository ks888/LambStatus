import { routerReducer as router } from 'react-router-redux'
import { combineReducers } from 'redux'
import componentReducer from 'reducers/components'
import incidentReducer from 'reducers/incidents'
import userReducer from 'reducers/users'

const rootReducer = combineReducers({
  components: componentReducer,
  incidents: incidentReducer,
  user: userReducer,
  router
})

export default rootReducer
