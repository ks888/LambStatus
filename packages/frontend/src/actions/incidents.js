import 'whatwg-fetch'
import { checkStatus } from 'utils/fetch'
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
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
  }
}

export const fetchIncidentsWithUpdates = (callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'incidents')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        const obj = JSON.parse(json)
        if (obj.length !== 0) {
          obj.forEach(incident => dispatch(fetchIncidentUpdates(incident.incidentID)))
        } else {
          if (onSuccess && typeof onSuccess === 'function') onSuccess()
        }
      })
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
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
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
  }
}

export const postIncident = (incidentID, name, incidentStatus, message, components, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
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
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(addIncident(json))
      })
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
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
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(editIncident(json))
      })
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
  }
}

export const deleteIncident = (incidentID, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'incidents/' + incidentID, {
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(removeIncident(incidentID))
      })
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          if (onFailure && typeof onFailure === 'function') onFailure(error.message)
        }
      })
  }
}
