import { LIST_INCIDENTS, LIST_INCIDENT_UPDATES, ADD_INCIDENT, EDIT_INCIDENT,
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

function listIncidentUpdatesHandler (state = { }, action) {
  const incidentUpdates = action.incidentUpdates
  incidentUpdates.sort((a, b) => {
    return a.createdAt < b.createdAt
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
    incidents: newIncidents
  })
}

function addIncidentHandler (state = { }, action) {
  const {
    incident
  } = action.response

  return Object.assign({}, state, {
    incidents: [
      incident,
      ...state.incidents
    ]
  })
}

function editIncidentHandler (state = { }, action) {
  const {
    incident: updatedIncident
  } = action.response

  const newIncidents = state.incidents.map((incident) => {
    if (incident.incidentID === updatedIncident.incidentID) {
      return updatedIncident
    }
    return incident
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
  [LIST_INCIDENT_UPDATES]: listIncidentUpdatesHandler,
  [ADD_INCIDENT]: addIncidentHandler,
  [EDIT_INCIDENT]: editIncidentHandler,
  [REMOVE_INCIDENT]: removeIncidentHandler
}

export default function incidentsReducer (state = {
  incidents: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
