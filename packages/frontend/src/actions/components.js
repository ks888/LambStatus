import 'whatwg-fetch'
import { checkStatus, buildHeaders } from 'utils/fetch'
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
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'components')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(listComponents(json))
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

export const postComponent = (name, description, status, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(apiURL + 'components', {
      headers: buildHeaders(),
      method: 'POST',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(addComponent(json))
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

export const updateComponent = (componentID, name, description, status, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(apiURL + 'components/' + componentID, {
      headers: buildHeaders(),
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(editComponent(json))
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

export const deleteComponent = (componentID, callbacks = {}) => {
  const { onLoad, onSuccess, onFailure } = callbacks
  return dispatch => {
    if (onLoad && typeof onLoad === 'function') onLoad()
    return fetch(apiURL + 'components/' + componentID, {
      headers: buildHeaders(),
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => {
        if (onSuccess && typeof onSuccess === 'function') onSuccess()
        dispatch(removeComponent(componentID))
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
