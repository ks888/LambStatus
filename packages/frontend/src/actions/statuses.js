import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

const ACTION_NAME_PREFIX = 'STATUSES_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const FINISH_LOAD = ACTION_NAME_PREFIX + 'FINISH_LOAD'
export const LIST_INCIDENT = ACTION_NAME_PREFIX + 'LIST_INCIDENT'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'

export function loadAction () {
  return {
    type: LOAD
  }
}

export function finishLoadAction () {
  return {
    type: FINISH_LOAD
  }
}

export function listIncidentAction (incident) {
  return {
    type: LIST_INCIDENT,
    incident: incident
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
  return fetch(apiURL + 'incidents')
    .then(checkStatus)
    .then(response => response.json())
    .then(json => {
      const obj = JSON.parse(json)
      if (obj.length !== 0) {
        obj.forEach((incident) =>
          dispatch(fetchIncidentUpdates(incident))
        )
      } else {
        dispatch(finishLoadAction())
      }
    }).catch(error => {
      console.error(error.message)
      console.error(error.stack)
    })
}

export const fetchIncidentUpdates = (incident) => {
  return (dispatch) => {
    dispatch(loadAction())
    return fetch(apiURL + 'incidents/' + incident.incidentID + '/incidentupdates')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        incident.incidentUpdates = JSON.parse(json)
        dispatch(listIncidentAction(incident))
      }).catch(error => {
        console.error(error.message)
        console.error(error.stack)
      })
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(loadAction())
  return fetch(apiURL + 'components')
    .then(checkStatus)
    .then(response => response.json())
    .then(json => dispatch(listComponentsAction(json)))
    .catch(error => {
      console.error(error.message)
      console.error(error.stack)
    })
}

export const actions = {
  loadAction,
  listIncidentAction,
  listComponentsAction
}
