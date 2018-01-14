import 'whatwg-fetch'
import { sendRequest, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const LIST_SETTINGS = 'LIST_SETTINGS'
export const EDIT_SETTINGS = 'EDIT_SETTINGS'
export const EDIT_LOGO = 'EDIT_LOGO'
export const ADD_API_KEY = 'ADD_API_KEY'
export const REMOVE_API_KEY = 'REMOVE_API_KEY'

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

export function editLogo (json) {
  return {
    type: EDIT_LOGO,
    logo: json
  }
}

export function addApiKey (json) {
  return {
    type: ADD_API_KEY,
    apiKey: json
  }
}

export function removeApiKey (keyID) {
  return {
    type: REMOVE_API_KEY,
    keyID
  }
}

export const fetchSettings = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + '/api/settings', {
        headers: await buildHeaders()
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
      const json = await sendRequest(apiURL + '/api/public-settings', {}, callbacks)
      dispatch(listSettings(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateSettings = (serviceName, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { serviceName }
      const json = await sendRequest(apiURL + '/api/settings', {
        headers: await buildHeaders(),
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

export const postApiKey = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + '/api/settings/apikeys', {
        headers: await buildHeaders(),
        method: 'POST'
      }, callbacks)
      dispatch(addApiKey(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const deleteApiKey = (keyID, callbacks = {}) => {
  return async dispatch => {
    try {
      await sendRequest(`${apiURL}/api/settings/apikeys/${keyID}`, {
        headers: await buildHeaders(),
        method: 'DELETE'
      }, callbacks)
      dispatch(removeApiKey(keyID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const uploadLogo = (file, callbacks = {}) => {
  return async dispatch => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const json = await sendRequest(apiURL + '/api/settings/images/logo', {
        headers: await buildHeaders(),
        method: 'POST',
        body: formData
      }, callbacks)

      dispatch(editLogo(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}
