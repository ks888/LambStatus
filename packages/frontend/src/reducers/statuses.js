import { LOAD, FINISH_LOAD, LIST_INCIDENT, LIST_COMPONENTS } from 'actions/components'

function loadHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: true
  })
}

// finish loading with no data
function finishLoadHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: false
  })
}

function listIncidentHandler (state = { }, action) {
  action.incident.incidentUpdates.sort((a, b) => {
    return a.updatedAt < b.updatedAt
  })

  const newIncidents = [...state.incidents, action.incident].sort((a, b) => {
    return a.updatedAt < b.updatedAt
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: newIncidents
  })
}

function listComponentsHandler (state = { }, action) {
  let components = JSON.parse(action.components).map((component) => {
    return {
      componentID: component.componentID,
      name: component.name,
      description: component.description,
      status: component.status
    }
  })
  return Object.assign({}, state, {
    components: components
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [FINISH_LOAD]: finishLoadHandler,
  [LIST_INCIDENT]: listIncidentHandler
//  [LIST_COMPONENTS]: listComponentsHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function incidentsReducer (state = {
  isFetching: false,
  incidents: [],
  components: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
