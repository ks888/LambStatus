import 'whatwg-fetch'
import { sendRequest, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const LIST_MAINTENANCES = 'LIST_MAINTENANCES'
export const LIST_MAINTENANCE = 'LIST_MAINTENANCE'
export const ADD_MAINTENANCE = 'ADD_MAINTENANCE'
export const EDIT_MAINTENANCE = 'EDIT_MAINTENANCE'
export const EDIT_MAINTENANCE_UPDATE = 'EDIT_MAINTENANCE_UPDATE'
export const REMOVE_MAINTENANCE = 'REMOVE_MAINTENANCE'

export function listMaintenances (json) {
  return {
    type: LIST_MAINTENANCES,
    maintenances: json
  }
}

export function listMaintenance (json, maintenanceID) {
  return {
    type: LIST_MAINTENANCE,
    maintenance: json,
    maintenanceID: maintenanceID
  }
}

export function addMaintenance (json) {
  return {
    type: ADD_MAINTENANCE,
    response: json
  }
}

export function editMaintenance (json) {
  return {
    type: EDIT_MAINTENANCE,
    response: json
  }
}

export function editMaintenanceUpdate (json) {
  return {
    type: EDIT_MAINTENANCE_UPDATE,
    response: json
  }
}

export function removeMaintenance (maintenanceID) {
  return {
    type: REMOVE_MAINTENANCE,
    maintenanceID: maintenanceID
  }
}

export const fetchMaintenances = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + '/api/maintenances', {}, callbacks)
      dispatch(listMaintenances(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const fetchMaintenance = (maintenanceID, callbacks = {}) => {
  return async dispatch => {
    try {
      const url = `${apiURL}/api/maintenances/${maintenanceID}`
      const json = await sendRequest(url, {}, callbacks)
      dispatch(listMaintenance(json, maintenanceID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const postMaintenance = ({name, maintenanceStatus, startAt, endAt, message, components}, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { name, status: maintenanceStatus, startAt, endAt, message, components }
      const json = await sendRequest(apiURL + '/api/maintenances', {
        headers: await buildHeaders(),
        method: 'POST',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(addMaintenance(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateMaintenance = ({maintenanceID, name, maintenanceStatus, startAt, endAt, message,
                                   components, createdAt}, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { name, status: maintenanceStatus, startAt, endAt, message, components, createdAt }
      const json = await sendRequest(apiURL + '/api/maintenances/' + maintenanceID, {
        headers: await buildHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(editMaintenance(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateMaintenanceUpdate = ({maintenanceID, maintenanceUpdateID, maintenanceStatus, message, createdAt},
                                        callbacks = {}) => {
  return async dispatch => {
    try {
      const body = {
        maintenanceStatus,
        message,
        createdAt
      }
      const json = await sendRequest(`${apiURL}/api/maintenances/${maintenanceID}/maintenanceupdates/${maintenanceUpdateID}`, {
        headers: await buildHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(editMaintenanceUpdate(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const deleteMaintenance = (maintenanceID, callbacks = {}) => {
  return async dispatch => {
    try {
      await sendRequest(apiURL + '/api/maintenances/' + maintenanceID, {
        headers: await buildHeaders(),
        method: 'DELETE'
      }, callbacks)
      dispatch(removeMaintenance(maintenanceID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}
