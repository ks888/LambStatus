import 'whatwg-fetch'
import { sendRequest, buildHeaders } from 'utils/fetch'
import { apiURL } from 'utils/settings'

export const LIST_COMPONENTS = 'LIST_COMPONENTS'
export const ADD_COMPONENT = 'ADD_COMPONENT'
export const EDIT_COMPONENT = 'EDIT_COMPONENT'
export const REMOVE_COMPONENT = 'REMOVE_COMPONENT'

export function listComponents (json) {
  return {
    type: LIST_COMPONENTS,
    components: json
  }
}

export function addComponent (json) {
  return {
    type: ADD_COMPONENT,
    component: json
  }
}

export function editComponent (json) {
  return {
    type: EDIT_COMPONENT,
    component: json
  }
}

export function removeComponent (componentID) {
  return {
    type: REMOVE_COMPONENT,
    componentID
  }
}

export const fetchComponents = (callbacks = {}) => {
  return async dispatch => {
    try {
      const json = await sendRequest(apiURL + 'components', {}, callbacks)
      dispatch(listComponents(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const postComponent = (name, description, status, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { name, description, status }
      const json = await sendRequest(apiURL + 'components', {
        headers: buildHeaders(),
        method: 'POST',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(addComponent(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const updateComponent = (componentID, name, description, status, order, callbacks = {}) => {
  return async dispatch => {
    try {
      const body = { name, description, status, order }
      const json = await sendRequest(apiURL + 'components/' + componentID, {
        headers: buildHeaders(),
        method: 'PATCH',
        body: JSON.stringify(body)
      }, callbacks)
      dispatch(editComponent(json))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}

export const deleteComponent = (componentID, callbacks = {}) => {
  return async dispatch => {
    try {
      await sendRequest(apiURL + 'components/' + componentID, {
        headers: buildHeaders(),
        method: 'DELETE'
      }, callbacks)
      dispatch(removeComponent(componentID))
    } catch (error) {
      console.error(error.message)
      console.error(error.stack)
    }
  }
}
