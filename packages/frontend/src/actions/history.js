import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

const ACTION_NAME_PREFIX = 'HISTORY_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const LIST_INCIDENTS = ACTION_NAME_PREFIX + 'LIST_INCIDENTS'
export const LIST_INCIDENT_UPDATES = ACTION_NAME_PREFIX + 'LIST_INCIDENT_UPDATES'

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
