import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { routerMiddleware, routerReducer as router } from 'react-router-redux'
import thunk from 'redux-thunk'
import componentReducer from 'routes/Components/modules/components'
import incidentReducer from 'routes/Incidents/modules/incidents'
import statusesReducer from 'routes/Statuses/modules/statuses'
import historyReducer from 'routes/History/modules/history'

export default (initialState = {}, history) => {
  const middleware = [thunk, routerMiddleware(history)]

  const enhancers = []
  if (__DEBUG__) {
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  return createStore(
    combineReducers({
      components: componentReducer,
      incidents: incidentReducer,
      statuses: statusesReducer,
      history: historyReducer,
      router
    }),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
}
