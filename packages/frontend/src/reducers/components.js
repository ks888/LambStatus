import { requestStatus } from 'utils/status'
import { SET_STATUS, LIST_COMPONENTS, ADD_COMPONENT, EDIT_COMPONENT,
  REMOVE_COMPONENT, SET_ERROR } from 'actions/components'

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
