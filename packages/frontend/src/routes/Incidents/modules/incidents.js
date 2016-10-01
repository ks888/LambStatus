// ------------------------------------
// Constants
// ------------------------------------
export const LOAD = 'LOAD'
export const LIST_INCIDENTS = 'LIST_INCIDENTS'
export const LIST_COMPONENTS = 'LIST_COMPONENTS'
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
  }).then(response => response.json())
    .then(json => dispatch(listIncidentsAction(json)))
    .catch(error => {
      console.error(error, error.stack)
    })
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
    }).then(response => response.json())
      .then(json => dispatch(updateIncident(json)))
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
    }).then(response => dispatch(removeIncidentAction(incidentID)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const actions = {
  loadAction,
  listIncidentsAction,
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
  return Object.assign({}, state, {
    isFetching: false,
    incidents: incidents
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
  let updatedIncident = JSON.parse(action.incident)
  state.incidents.forEach((incident) => {
    if (incident.incidentID === updatedIncident.incidentID) {
      incident.name = updatedIncident.name
      incident.status = updatedIncident.status
      incident.updatedAt = updatedIncident.updatedAt
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
