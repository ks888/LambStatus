import { LIST_INCIDENTS, LIST_INCIDENT, ADD_INCIDENT, EDIT_INCIDENT, EDIT_INCIDENT_UPDATE,
  REMOVE_INCIDENT } from 'actions/incidents'

function listIncidentsHandler (state = { }, action) {
  const incidents = action.incidents
  incidents.sort((a, b) => {
    return a.createdAt < b.createdAt
  })

  return Object.assign({}, state, {
    incidents: incidents
  })
}

function listIncidentHandler (state = { }, action) {
  action.incident.incidentUpdates.sort((a, b) => {
    return a.createdAt < b.createdAt
  })

  const newIncidents = state.incidents.map((incident) => {
    if (incident.incidentID === action.incidentID) {
      return action.incident
    }
    return incident
  })

  return Object.assign({}, state, {
    incidents: newIncidents
  })
}

function addIncidentHandler (state = { }, action) {
  delete action.response.components

  return Object.assign({}, state, {
    incidents: [
      action.response,
      ...state.incidents
    ]
  })
}

function editIncidentHandler (state = { }, action) {
  delete action.response.components

  const newIncidents = state.incidents.map((incident) => {
    if (incident.incidentID === action.response.incidentID) {
      return action.response
    }
    return incident
  })

  return Object.assign({}, state, {
    incidents: newIncidents
  })
}

function editIncidentUpdateHandler (state = { }, action) {
  const updatedIncidentUpdate = action.response

  const newIncidents = state.incidents.map((incident) => {
    if (incident.incidentID !== updatedIncidentUpdate.incidentID) {
      return incident
    }

    const newIncidentUpdates = incident.incidentUpdates.map((incidentUpdate) => {
      if (incidentUpdate.incidentUpdateID !== updatedIncidentUpdate.incidentUpdateID) {
        return incidentUpdate
      }
      return updatedIncidentUpdate
    })
    return {...incident, incidentUpdates: newIncidentUpdates}
  })

  return Object.assign({}, state, {
    incidents: newIncidents
  })
}

function removeIncidentHandler (state = { }, action) {
  const newIncidents = state.incidents.filter((incident) => {
    return incident.incidentID !== action.incidentID
  })

  return Object.assign({}, state, {
    incidents: newIncidents
  })
}

const ACTION_HANDLERS = {
  [LIST_INCIDENTS]: listIncidentsHandler,
  [LIST_INCIDENT]: listIncidentHandler,
  [ADD_INCIDENT]: addIncidentHandler,
  [EDIT_INCIDENT]: editIncidentHandler,
  [EDIT_INCIDENT_UPDATE]: editIncidentUpdateHandler,
  [REMOVE_INCIDENT]: removeIncidentHandler
}

export default function incidentsReducer (state = {
  incidents: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
