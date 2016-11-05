import { checkStatus } from 'utils/fetch'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_NAME_PREFIX = 'STATUSES_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const FINISH_LOAD = ACTION_NAME_PREFIX + 'FINISH_LOAD'
export const LIST_INCIDENT = ACTION_NAME_PREFIX + 'LIST_INCIDENT'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'

// ------------------------------------
// Actions
// ------------------------------------

export function loadAction () {
  return {
    type: LOAD
  }
}

export function finishLoadAction () {
  return {
    type: FINISH_LOAD
  }
}

export function listIncidentAction (incident) {
  return {
    type: LIST_INCIDENT,
    incident: incident
  }
}

export function listComponentsAction (json) {
  return {
    type: LIST_COMPONENTS,
    components: json
  }
}

export const fetchIncidents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__LAMBSTATUS_API_URL__ + 'incidents')
    .then(checkStatus)
    .then(response => response.json())
    .then(json => {
      const obj = JSON.parse(json)
      if (obj.length !== 0) {
        obj.forEach((incident) =>
          dispatch(fetchIncidentUpdates(incident))
        )
      } else {
        dispatch(finishLoadAction())
      }
    }).catch(error => {
      console.error(error.message)
      console.error(error.stack)
    })
}

export const fetchIncidentUpdates = (incident) => {
  return (dispatch) => {
    dispatch(loadAction())
    return fetch(__LAMBSTATUS_API_URL__ + 'incidents/' + incident.incidentID + '/incidentupdates')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        incident.incidentUpdates = JSON.parse(json)
        dispatch(listIncidentAction(incident))
      }).catch(error => {
        console.error(error.message)
        console.error(error.stack)
      })
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__LAMBSTATUS_API_URL__ + 'components')
    .then(checkStatus)
    .then(response => response.json())
    .then(json => dispatch(listComponentsAction(json)))
    .catch(error => {
      console.error(error.message)
      console.error(error.stack)
    })
}

export const actions = {
  loadAction,
  listIncidentAction,
  listComponentsAction
}

// ------------------------------------
// Action Handlers
// ------------------------------------

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

  return Object.assign({}, state, {
    isFetching: false,
    incidents: [...state.incidents, action.incident]
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
  [LIST_INCIDENT]: listIncidentHandler,
  [LIST_COMPONENTS]: listComponentsHandler
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
