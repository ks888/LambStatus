import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_NAME_PREFIX = 'HISTORY_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const LIST_INCIDENTS = ACTION_NAME_PREFIX + 'LIST_INCIDENTS'
export const LIST_INCIDENT_UPDATES = ACTION_NAME_PREFIX + 'LIST_INCIDENT_UPDATES'

// ------------------------------------
// Actions
// ------------------------------------

export function loadAction () {
  return {
    type: LOAD
  }
}

export function listIncidentsAction (json) {
  return {
    type: LIST_INCIDENTS,
    incidents: json
  }
}

export function listIncidentUpdatesAction (json, incidentID) {
  return {
    type: LIST_INCIDENT_UPDATES,
    incidentUpdates: json,
    incidentID: incidentID
  }
}

export const fetchIncidents = (dispatch) => {
  dispatch(loadAction())
  return fetch(apiURL + 'incidents')
    .then(checkStatus)
    .then(response => response.json())
    .then(json => dispatch(listIncidentsAction(json)))
    .catch(error => {
      console.error(error.message)
      console.error(error.stack)
    })
}

export const fetchIncidentUpdates = (incidentID) => {
  return (dispatch) => {
    dispatch(loadAction())
    return fetch(apiURL + 'incidents/' + incidentID + '/incidentupdates')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(listIncidentUpdatesAction(json, incidentID)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
      })
  }
}

export const actions = {
  loadAction,
  listIncidentsAction,
  listIncidentUpdatesAction
}

// ------------------------------------
// Action Handlers
// ------------------------------------

function loadHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: true
  })
}

function listIncidentsHandler (state = { }, action) {
  let incidents = JSON.parse(action.incidents).map((incident) => {
    return {
      incidentID: incident.incidentID,
      name: incident.name,
      status: incident.status,
      updatedAt: incident.updatedAt
    }
  })

  incidents.sort((a, b) => {
    return a.updatedAt < b.updatedAt
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: incidents
  })
}

function listIncidentUpdatesHandler (state = { }, action) {
  let incidentUpdates = JSON.parse(action.incidentUpdates).map((incidentUpdate) => {
    return {
      incidentUpdateID: incidentUpdate.incidentUpdateID,
      incidentStatus: incidentUpdate.incidentStatus,
      message: incidentUpdate.message,
      updatedAt: incidentUpdate.updatedAt
    }
  })

  incidentUpdates.sort((a, b) => {
    return a.updatedAt < b.updatedAt
  })

  const newIncidents = state.incidents.map((incident) => {
    if (incident.incidentID === action.incidentID) {
      return Object.assign({}, incident, {
        incidentUpdates: incidentUpdates
      })
    }
    return incident
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: newIncidents
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_INCIDENTS]: listIncidentsHandler,
  [LIST_INCIDENT_UPDATES]: listIncidentUpdatesHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function incidentsReducer (state = {
  isFetching: false,
  incidents: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
