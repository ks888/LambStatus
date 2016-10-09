import { checkStatus } from 'utils/fetch'

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
    incident: json
  }
}

export function updateIncidentAction (json) {
  return {
    type: UPDATE_INCIDENT,
    incident: json
  }
}

export function removeIncidentAction (incidentID) {
  return {
    type: REMOVE_INCIDENT,
    incidentID: incidentID
  }
}

export const fetchIncidents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__API_URL__ + 'incidents', {
    headers: { 'x-api-key': __API_KEY__ }
  }).then(checkStatus)
    .then(response => response.json())
    .then(json => dispatch(listIncidentsAction(json)))
    .catch(error => {
      console.error(error)
      try {
        error.response.text()
          .then(body => console.error(body))
      } catch (error) {
        console.error(error)
      }
    })
}

export const fetchIncidentUpdates = (incidentID) => {
  return (dispatch) => {
    dispatch(loadAction())
    return fetch(__API_URL__ + 'incidents/' + incidentID + '/incidentupdates', {
      headers: { 'x-api-key': __API_KEY__ }
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(listIncidentUpdatesAction(json, incidentID)))
      .catch(error => {
        console.error(error)
        try {
          error.response.text()
            .then(body => console.error(body))
        } catch (error) {
          console.error(error)
        }
      })
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__API_URL__ + 'components', {
    headers: { 'x-api-key': __API_KEY__ }
  }).then(response => response.json())
    .then(json => dispatch(listComponentsAction(json)))
    .catch(error => {
      console.error(error, error.stack)
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
    return fetch(__API_URL__ + 'incidents', {
      headers: { 'X-api-key': __API_KEY__, 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    }).then(response => response.json())
      .then(json => dispatch(addIncidentAction(json)))
      .catch(error => {
        console.error(error, error.stack)
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
    return fetch(__API_URL__ + 'incidents/' + incidentID, {
      headers: { 'X-api-key': __API_KEY__, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(updateIncidentAction(json)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const deleteIncident = (incidentID) => {
  return dispatch => {
    dispatch(loadAction())
    return fetch(__API_URL__ + 'incidents/' + incidentID, {
      headers: { 'X-api-key': __API_KEY__ },
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => dispatch(removeIncidentAction(incidentID)))
      .catch(error => {
        console.error(error, error.stack)
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
  removeIncidentAction
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

  state.incidents.forEach((incident) => {
    if (incident.incidentID === action.incidentID) {
      incident.incidentUpdates = incidentUpdates
    }
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: state.incidents
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
  let incident = JSON.parse(action.incident)
  return Object.assign({}, state, {
    isFetching: false,
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
  let resp = JSON.parse(action.incident)
  state.incidents.forEach((incident) => {
    if (incident.incidentID === resp.incident.incidentID) {
      incident.name = resp.incident.name
      incident.status = resp.incident.status
      incident.updatedAt = resp.incident.updatedAt
    }
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: state.incidents
  })
}

function removeIncidentHandler (state = { }, action) {
  let incidents = state.incidents.filter((incident) => {
    return incident.incidentID !== action.incidentID
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: incidents
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_INCIDENTS]: listIncidentsHandler,
  [LIST_INCIDENT_UPDATES]: listIncidentUpdatesHandler,
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_INCIDENT]: addIncidentHandler,
  [UPDATE_INCIDENT]: updateIncidentHandler,
  [REMOVE_INCIDENT]: removeIncidentHandler
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
