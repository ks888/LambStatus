import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_NAME_PREFIX = 'COMPONENTS_'
export const SET_STATUS = ACTION_NAME_PREFIX + 'SET_STATUS'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'
export const ADD_COMPONENT = ACTION_NAME_PREFIX + 'ADD_COMPONENT'
export const EDIT_COMPONENT = ACTION_NAME_PREFIX + 'EDIT_COMPONENT'
export const REMOVE_COMPONENT = ACTION_NAME_PREFIX + 'REMOVE_COMPONENT'
export const SET_ERROR = ACTION_NAME_PREFIX + 'SET_ERROR'

export const requestStatus = {
  none: 0,
  inProgress: 1,
  success: 2,
  failure: 3
}

// ------------------------------------
// Actions
// ------------------------------------

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

// ------------------------------------
// Action Handlers
// ------------------------------------

function setStatusHandler (state = { }, action) {
  return Object.assign({}, state, {
    message: '',
    ...action.status
  })
}

function listComponentsHandler (state = { }, action) {
  let components = JSON.parse(action.serviceComponents).map((component) => {
    return {
      componentID: component.componentID,
      name: component.name,
      description: component.description,
      status: component.status,
      order: component.order
    }
  })
  return Object.assign({}, state, {
    loadStatus: requestStatus.success,
    serviceComponents: components
  })
}

function addComponentHandler (state = { }, action) {
  let component = JSON.parse(action.serviceComponent)
  return Object.assign({}, state, {
    updateStatus: requestStatus.success,
    serviceComponents: [
      ...state.serviceComponents,
      {
        componentID: component.componentID,
        name: component.name,
        description: component.description,
        status: component.status,
        order: component.order
      }
    ]
  })
}

function editComponentHandler (state = { }, action) {
  let editedComponent = JSON.parse(action.serviceComponent)

  const newComponents = state.serviceComponents.map((component) => {
    if (component.componentID === editedComponent.componentID) {
      return Object.assign({}, component, {
        name: editedComponent.name,
        description: editedComponent.description,
        status: editedComponent.status,
        order: editedComponent.order
      })
    }
    return component
  })

  newComponents.sort((a, b) => a.order - b.order)

  return Object.assign({}, state, {
    updateStatus: requestStatus.success,
    serviceComponents: newComponents
  })
}

function removeComponentHandler (state = { }, action) {
  let serviceComponents = state.serviceComponents.filter((component) => {
    return component.componentID !== action.componentID
  })

  return Object.assign({}, state, {
    updateStatus: requestStatus.success,
    serviceComponents: serviceComponents
  })
}

function setErrorHandler (state = { }, action) {
  return Object.assign({}, state, {
    loadStatus: requestStatus.failure,
    updateStatus: requestStatus.failure,
    message: action.message
  })
}

const ACTION_HANDLERS = {
  [SET_STATUS]: setStatusHandler,
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_COMPONENT]: addComponentHandler,
  [EDIT_COMPONENT]: editComponentHandler,
  [REMOVE_COMPONENT]: removeComponentHandler,
  [SET_ERROR]: setErrorHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function componentsReducer (state = {
  loadStatus: requestStatus.none,
  updateStatus: requestStatus.none,
  serviceComponents: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
