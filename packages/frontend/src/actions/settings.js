import 'whatwg-fetch'
import { sendRequest, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const LIST_SETTINGS = 'LIST_SETTINGS'
export const EDIT_SETTINGS = 'EDIT_SETTINGS'

export function listSettings (json) {
  return {
    type: LIST_SETTINGS,
    settings: json
  }
}

export function editSettings (json) {
  return {
    type: EDIT_SETTINGS,
    settings: json
  }
}

export const fetchSettings = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + 'settings', {
        headers: buildHeaders()
      }, callbacks)
      dispatch(listSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const fetchPublicSettings = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + 'public-settings', {}, callbacks)
      dispatch(listSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateSettings = (serviceName, adminPageURL, statusPageURL, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { serviceName, adminPageURL, statusPageURL }
      const json = await sendRequest(apiURL + 'settings', {
        headers: buildHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(editSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}
