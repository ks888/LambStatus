import { requestStatus } from 'utils/status'
import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

const ACTION_NAME_PREFIX = 'COMPONENTS_'
export const SET_STATUS = ACTION_NAME_PREFIX + 'SET_STATUS'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'
export const ADD_COMPONENT = ACTION_NAME_PREFIX + 'ADD_COMPONENT'
export const EDIT_COMPONENT = ACTION_NAME_PREFIX + 'EDIT_COMPONENT'
export const REMOVE_COMPONENT = ACTION_NAME_PREFIX + 'REMOVE_COMPONENT'
export const SET_ERROR = ACTION_NAME_PREFIX + 'SET_ERROR'

export function setStatusAction (status) {
  return {
    type: SET_STATUS,
    status
  }
}

export function listComponentsAction (json) {
  return {
    type: LIST_COMPONENTS,
    serviceComponents: json
  }
}

export function addComponentAction (json) {
  return {
    type: ADD_COMPONENT,
    serviceComponent: json
  }
}

export function editComponentAction (json) {
  return {
    type: EDIT_COMPONENT,
    serviceComponent: json
  }
}

export function removeComponentAction (componentID) {
  return {
    type: REMOVE_COMPONENT,
    componentID: componentID
  }
}

export function setErrorAction (message) {
  return {
    type: SET_ERROR,
    message: message
  }
}

export const fetchComponents = () => {
  return dispatch => {
    dispatch(setStatusAction({loadStatus: requestStatus.inProgress}))
    return fetch(apiURL + 'components')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(listComponentsAction(json)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(setStatusAction({loadStatus: requestStatus.failure}))
          dispatch(setErrorAction(error.message))
          return
        }
      })
  }
}

export const postComponent = (name, description, status) => {
  return dispatch => {
    dispatch(setStatusAction({updateStatus: requestStatus.inProgress}))
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(apiURL + 'components', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(addComponentAction(json)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(setStatusAction({updateStatus: requestStatus.failure}))
          dispatch(setErrorAction(error.message))
          return
        }
      })
  }
}

export const updateComponent = (componentID, name, description, status) => {
  return dispatch => {
    dispatch(setStatusAction({updateStatus: requestStatus.inProgress}))
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(apiURL + 'components/' + componentID, {
      headers: { 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(editComponentAction(json)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(setStatusAction({updateStatus: requestStatus.failure}))
          dispatch(setErrorAction(error.message))
          return
        }
      })
  }
}

export const deleteComponent = (componentID) => {
  return dispatch => {
    dispatch(setStatusAction({updateStatus: requestStatus.inProgress}))
    return fetch(apiURL + 'components/' + componentID, {
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => dispatch(removeComponentAction(componentID)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(setStatusAction({updateStatus: requestStatus.failure}))
          dispatch(setErrorAction(error.message))
          return
        }
      })
  }
}

export const actions = {
  setStatusAction,
  listComponentsAction,
  addComponentAction,
  editComponentAction,
  removeComponentAction,
  setErrorAction
}
