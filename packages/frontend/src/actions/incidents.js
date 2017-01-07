import 'whatwg-fetch'
import { checkStatus, handleError, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const LIST_INCIDENTS = 'LIST_INCIDENTS'
export const LIST_INCIDENT_UPDATES = 'LIST_INCIDENT_UPDATES'
export const ADD_INCIDENT = 'ADD_INCIDENT'
export const EDIT_INCIDENT = 'EDIT_INCIDENT'
export const REMOVE_INCIDENT = 'REMOVE_INCIDENT'

export function listIncidents (json) {
  return {
    type: LIST_INCIDENTS,
    incidents: json
  }
}

export function listIncidentUpdates (json, incidentID) {
  return {
    type: LIST_INCIDENT_UPDATES,
    incidentUpdates: json,
    incidentID: incidentID
  }
}

export function addIncident (json) {
  return {
    type: ADD_INCIDENT,
    response: json
  }
}

export function editIncident (json) {
  return {
    type: EDIT_INCIDENT,
    response: json
  }
}

export function removeIncident (incidentID) {
  return {
    type: REMOVE_INCIDENT,
    incidentID: incidentID
  }
}

export const fetchIncidents = (callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'incidents')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listIncidents(json))
      })
      .catch(handleError(onFailure))
  }
}

export const fetchIncidentUpdates = (incidentID, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'incidents/' + incidentID + '/incidentupdates')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listIncidentUpdates(json, incidentID))
      })
      .catch(handleError(onFailure))
  }
}

export const postIncident = (name, incidentStatus, message, components, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    let body = {
      name: name,
      incidentStatus: incidentStatus,
      message: message,
      components: components
    }
    return fetch(apiURL + 'incidents', {
      headers: buildHeaders(),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(addIncident(json))
      })
      .catch(handleError(onFailure))
  }
}

export const updateIncident = (incidentID, name, incidentStatus, message, components, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    let body = {
      name: name,
      incidentStatus: incidentStatus,
      message: message,
      components: components
    }
    return fetch(apiURL + 'incidents/' + incidentID, {
      headers: buildHeaders(),
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(editIncident(json))
      })
      .catch(handleError(onFailure))
  }
}

export const deleteIncident = (incidentID, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'incidents/' + incidentID, {
      headers: buildHeaders(),
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(removeIncident(incidentID))
      })
      .catch(handleError(onFailure))
  }
}
