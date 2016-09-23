// ------------------------------------
// Constants
// ------------------------------------
export const LOAD = 'LOAD'
export const LIST_INCIDENTS = 'LIST_INCIDENTS'
export const ADD_INCIDENT = 'ADD_INCIDENT'
export const UPDATE_INCIDENT = 'UPDATE_INCIDENT'
export const REMOVE_INCIDENT = 'REMOVE_INCIDENT'

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

export function removeIncidentAction (id) {
  return {
    type: REMOVE_INCIDENT,
    incidentId: id
  }
}

export const fetchIncidents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__API_URL__ + 'incidents', {
    headers: { 'x-api-key': __API_KEY__ }
  }).then(response => response.json())
    .then(json => dispatch(listIncidentsAction(json)))
    .catch(error => {
      console.error(error, error.stack)
    })
}

export const postIncident = (id, name, message, impact, componentIDs, status) => {
  return dispatch => {
    dispatch(loadAction())
    let body = {
      name: name,
      message: message,
      impact: impact,
      componentIDs: componentIDs,
      status: status
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

export const updateIncident = (id, name, message, impact, componentIDs, status) => {
  return dispatch => {
    dispatch(loadAction())
    let body = {
      name: name,
      message: message,
      impact: impact,
      componentIDs: componentIDs,
      status: status
    }
    return fetch(__API_URL__ + 'incidents/' + id, {
      headers: { 'X-api-key': __API_KEY__, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(response => response.json())
      .then(json => dispatch(updateIncident(json)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const deleteIncident = (id) => {
  return dispatch => {
    dispatch(loadAction())
    return fetch(__API_URL__ + 'incidents/' + id, {
      headers: { 'X-api-key': __API_KEY__ },
      method: 'DELETE'
    }).then(response => dispatch(removeIncidentAction(id)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const actions = {
  loadAction,
  listIncidentsAction,
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
      id: incident.ID,
      name: incident.name,
      impact: incident.impact,
      updated_at: incident.updated_at
    }
  })
  return Object.assign({}, state, {
    isFetching: false,
    incidents: incidents
  })
}

function addIncidentHandler (state = { }, action) {
  let incident = JSON.parse(action.incident)
  return Object.assign({}, state, {
    isFetching: false,
    incidents: [
      ...state.incidents,
      {
        id: incident.ID,
        name: incident.name,
        impact: incident.impact,
        updated_at: incident.updated_at
      }
    ]
  })
}

function updateIncidentHandler (state = { }, action) {
  let updatedIncident = JSON.parse(action.incident)
  state.incidents.forEach((incident) => {
    if (incident.id === updatedIncident.ID) {
      incident.name = updatedIncident.name
      incident.impact = updatedIncident.impact
      incident.updated_at = updatedIncident.updated_at
    }
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: state.incidents
  })
}

function removeIncidentHandler (state = { }, action) {
  let incidents = state.incidents.filter((incident) => {
    return incident.id !== action.incidentId
  })

  return Object.assign({}, state, {
    isFetching: false,
    incidents: incidents
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_INCIDENTS]: listIncidentsHandler,
  [ADD_INCIDENT]: addIncidentHandler,
  [UPDATE_INCIDENT]: updateIncidentHandler,
  [REMOVE_INCIDENT]: removeIncidentHandler
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
