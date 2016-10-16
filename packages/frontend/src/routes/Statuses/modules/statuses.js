import { checkStatus } from 'utils/fetch'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_NAME_PREFIX = 'STATUSES_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const LIST_INCIDENTS = ACTION_NAME_PREFIX + 'LIST_INCIDENTS'
export const LIST_INCIDENT_UPDATES = ACTION_NAME_PREFIX + 'LIST_INCIDENT_UPDATES'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'

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

export const fetchIncidents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__API_URL__ + 'incidents')
    .then(checkStatus)
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
    return fetch(__API_URL__ + 'incidents/' + incidentID + '/incidentupdates')
      .then(checkStatus)
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
  return fetch(__API_URL__ + 'components')
    .then(response => response.json())
    .then(json => dispatch(listComponentsAction(json)))
    .catch(error => {
      console.error(error, error.stack)
    })
}

export const actions = {
  loadAction,
  listIncidentsAction,
  listIncidentUpdatesAction,
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
  [LIST_INCIDENTS]: listIncidentsHandler,
  [LIST_INCIDENT_UPDATES]: listIncidentUpdatesHandler,
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
