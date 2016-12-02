import { requestStatus } from 'utils/status'
import { SET_STATUS, LIST_INCIDENTS, LIST_INCIDENT_UPDATES, LIST_COMPONENTS,
  ADD_INCIDENT, UPDATE_INCIDENT, REMOVE_INCIDENT, SET_ERROR } from 'actions/incidents'

function setStatusHandler (state = { }, action) {
  return Object.assign({}, state, {
    message: '',
    ...action.status
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
    loadStatus: requestStatus.success,
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
    loadStatus: requestStatus.success,
    incidents: newIncidents
  })
}

function listComponentsHandler (state = { }, action) {
  let components = JSON.parse(action.serviceComponents).map((component) => {
    return {
      componentID: component.componentID,
      name: component.name,
      status: component.status
    }
  })
  return Object.assign({}, state, {
    loadStatus: requestStatus.success,
    components: components
  })
}

function addIncidentHandler (state = { }, action) {
  let {
    incident: incident, components: components
  } = JSON.parse(action.response)

  return Object.assign({}, state, {
    updateStatus: requestStatus.success,
    components: components,
    incidents: [
      {
        incidentID: incident.incidentID,
        name: incident.name,
        status: incident.status,
        updatedAt: incident.updatedAt
      },
      ...state.incidents
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
    updateStatus: requestStatus.success,
    components: components,
    incidents: newIncidents
  })
}

function removeIncidentHandler (state = { }, action) {
  let newIncidents = state.incidents.filter((incident) => {
    return incident.incidentID !== action.incidentID
  })

  return Object.assign({}, state, {
    updateStatus: requestStatus.success,
    incidents: newIncidents
  })
}

function setErrorHandler (state = { }, action) {
  return Object.assign({}, state, {
    loadStatus: requestStatus.failure,
    updateStatus: requestStatus.failure,
    message: action.message
  })
}

const ACTION_HANDLERS = {
  [SET_STATUS]: setStatusHandler,
  [LIST_INCIDENTS]: listIncidentsHandler,
  [LIST_INCIDENT_UPDATES]: listIncidentUpdatesHandler,
//  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_INCIDENT]: addIncidentHandler,
  [UPDATE_INCIDENT]: updateIncidentHandler,
  [REMOVE_INCIDENT]: removeIncidentHandler,
  [SET_ERROR]: setErrorHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function incidentsReducer (state = {
  loadStatus: requestStatus.none,
  updateStatus: requestStatus.none,
  incidents: [],
  components: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
