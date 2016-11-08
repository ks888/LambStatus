import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_NAME_PREFIX = 'INCIDENTS_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const LIST_INCIDENTS = ACTION_NAME_PREFIX + 'LIST_INCIDENTS'
export const LIST_INCIDENT_UPDATES = ACTION_NAME_PREFIX + 'LIST_INCIDENT_UPDATES'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'
export const ADD_INCIDENT = ACTION_NAME_PREFIX + 'ADD_INCIDENT'
export const UPDATE_INCIDENT = ACTION_NAME_PREFIX + 'UPDATE_INCIDENT'
export const REMOVE_INCIDENT = ACTION_NAME_PREFIX + 'REMOVE_INCIDENT'
export const SHOW_MESSAGE = ACTION_NAME_PREFIX + 'SHOW_MESSAGE'

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

export function listComponentsAction (json) {
  return {
    type: LIST_COMPONENTS,
    components: json
  }
}

export function addIncidentAction (json) {
  return {
    type: ADD_INCIDENT,
    response: json
  }
}

export function updateIncidentAction (json) {
  return {
    type: UPDATE_INCIDENT,
    response: json
  }
}

export function removeIncidentAction (incidentID) {
  return {
    type: REMOVE_INCIDENT,
    incidentID: incidentID
  }
}

export function showMessageAction (message) {
  return {
    type: SHOW_MESSAGE,
    message: message
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
      if (error.name === 'HTTPError') {
        dispatch(showMessageAction(error.message))
        return
      }
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
        if (error.name === 'HTTPError') {
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(loadAction())
  return fetch(apiURL + 'components')
    .then(checkStatus)
    .then(response => response.json())
    .then(json => dispatch(listComponentsAction(json)))
    .catch(error => {
      console.error(error.message)
      console.error(error.stack)
      if (error.name === 'HTTPError') {
        dispatch(showMessageAction(error.message))
        return
      }
    })
}

export const postIncident = (incidentID, name, incidentStatus, message, components) => {
  return dispatch => {
    dispatch(loadAction())
    // only a status attribute is allowed to update.
    components = components.map((component) => {
      return {
        componentID: component.componentID,
        status: component.status
      }
    })
    let body = {
      name: name,
      incidentStatus: incidentStatus,
      message: message,
      components: components
    }
    return fetch(apiURL + 'incidents', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(addIncidentAction(json)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const updateIncident = (incidentID, name, incidentStatus, message, components) => {
  return dispatch => {
    dispatch(loadAction())
    let body = {
      name: name,
      incidentStatus: incidentStatus,
      message: message,
      components: components
    }
    return fetch(apiURL + 'incidents/' + incidentID, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(updateIncidentAction(json)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const deleteIncident = (incidentID) => {
  return dispatch => {
    dispatch(loadAction())
    return fetch(apiURL + 'incidents/' + incidentID, {
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => dispatch(removeIncidentAction(incidentID)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const actions = {
  loadAction,
  listIncidentsAction,
  listIncidentUpdatesAction,
  listComponentsAction,
  addIncidentAction,
  updateIncidentAction,
  removeIncidentAction,
  showMessageAction
}

// ------------------------------------
// Action Handlers
// ------------------------------------

function loadHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: true,
    message: ''
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

function listComponentsHandler (state = { }, action) {
  let components = JSON.parse(action.components).map((component) => {
    return {
      componentID: component.componentID,
      name: component.name,
      status: component.status
    }
  })
  return Object.assign({}, state, {
    components: components
  })
}

function addIncidentHandler (state = { }, action) {
  let {
    incident: incident, components: components
  } = JSON.parse(action.response)

  return Object.assign({}, state, {
    isFetching: false,
    components: components,
    incidents: [
      ...state.incidents,
      {
        incidentID: incident.incidentID,
        name: incident.name,
        status: incident.status,
        updatedAt: incident.updatedAt
      }
    ]
  })
}

function updateIncidentHandler (state = { }, action) {
  let {
    incident: updatedIncident, components: components
  } = JSON.parse(action.response)

  const newIncidents = state.incidents.map((incident) => {
    if (incident.incidentID === updatedIncident.incidentID) {
      return Object.assign({}, incident, {
        name: updatedIncident.name,
        status: updatedIncident.status,
        updatedAt: updatedIncident.updatedAt
      })
    }
    return incident
  })

  return Object.assign({}, state, {
    isFetching: false,
    components: components,
    incidents: newIncidents
  })
}

function removeIncidentHandler (state = { }, action) {
  let newIncidents = state.incidents.filter((incident) => {
    return incident.incidentID !== action.incidentID
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: newIncidents
  })
}

function showMessageHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: false,
    message: action.message
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_INCIDENTS]: listIncidentsHandler,
  [LIST_INCIDENT_UPDATES]: listIncidentUpdatesHandler,
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_INCIDENT]: addIncidentHandler,
  [UPDATE_INCIDENT]: updateIncidentHandler,
  [REMOVE_INCIDENT]: removeIncidentHandler,
  [SHOW_MESSAGE]: showMessageHandler
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
