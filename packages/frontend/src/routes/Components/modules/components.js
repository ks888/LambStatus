import { checkStatus } from 'utils/fetch'
import { apiURL } from 'utils/settings'

// ------------------------------------
// Constants
// ------------------------------------
const ACTION_NAME_PREFIX = 'COMPONENTS_'
export const LOAD = ACTION_NAME_PREFIX + 'LOAD'
export const LIST_COMPONENTS = ACTION_NAME_PREFIX + 'LIST_COMPONENTS'
export const ADD_COMPONENT = ACTION_NAME_PREFIX + 'ADD_COMPONENT'
export const EDIT_COMPONENT = ACTION_NAME_PREFIX + 'EDIT_COMPONENT'
export const REMOVE_COMPONENT = ACTION_NAME_PREFIX + 'REMOVE_COMPONENT'
export const SHOW_MESSAGE = ACTION_NAME_PREFIX + 'SHOW_MESSAGE'

// ------------------------------------
// Actions
// ------------------------------------

export function loadAction () {
  return {
    type: LOAD
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

export function showMessageAction (message) {
  return {
    type: SHOW_MESSAGE,
    message: message
  }
}

export const fetchComponents = () => {
  return dispatch => {
    dispatch(loadAction())
    return fetch(apiURL + 'components')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(listComponentsAction(json)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const postComponent = (name, description, status) => {
  return dispatch => {
    dispatch(loadAction())
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
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const updateComponent = (componentID, name, description, status) => {
  return dispatch => {
    dispatch(loadAction())
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
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const deleteComponent = (componentID) => {
  return dispatch => {
    dispatch(loadAction())
    return fetch(apiURL + 'components/' + componentID, {
      method: 'DELETE'
    }).then(checkStatus)
      .then(response => dispatch(removeComponentAction(componentID)))
      .catch(error => {
        console.error(error.message)
        console.error(error.stack)
        if (error.name === 'HTTPError') {
          dispatch(showMessageAction(error.message))
          return
        }
      })
  }
}

export const actions = {
  loadAction,
  listComponentsAction,
  addComponentAction,
  editComponentAction,
  removeComponentAction,
  showMessageAction
}

// ------------------------------------
// Action Handlers
// ------------------------------------

function loadHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: true,
    message: ''
  })
}

function listComponentsHandler (state = { }, action) {
  let components = JSON.parse(action.serviceComponents).map((component) => {
    return {
      componentID: component.componentID,
      name: component.name,
      description: component.description,
      status: component.status
    }
  })
  return Object.assign({}, state, {
    isFetching: false,
    serviceComponents: components
  })
}

function addComponentHandler (state = { }, action) {
  let component = JSON.parse(action.serviceComponent)
  return Object.assign({}, state, {
    isFetching: false,
    serviceComponents: [
      ...state.serviceComponents,
      {
        componentID: component.componentID,
        name: component.name,
        description: component.description,
        status: component.status
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
        status: editedComponent.status
      })
    }
    return component
  })

  return Object.assign({}, state, {
    isFetching: false,
    serviceComponents: newComponents
  })
}

function removeComponentHandler (state = { }, action) {
  let serviceComponents = state.serviceComponents.filter((component) => {
    return component.componentID !== action.componentID
  })

  return Object.assign({}, state, {
    isFetching: false,
    serviceComponents: serviceComponents
  })
}

function showMessageHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: false,
    message: action.message
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_COMPONENT]: addComponentHandler,
  [EDIT_COMPONENT]: editComponentHandler,
  [REMOVE_COMPONENT]: removeComponentHandler,
  [SHOW_MESSAGE]: showMessageHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function componentsReducer (state = {
  isFetching: false,
  serviceComponents: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
