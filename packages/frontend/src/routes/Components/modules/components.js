// ------------------------------------
// Constants
// ------------------------------------
export const LOAD = 'LOAD'
export const LIST_COMPONENTS = 'LIST_COMPONENTS'
export const ADD_COMPONENT = 'ADD_COMPONENT'
export const EDIT_COMPONENT = 'EDIT_COMPONENT'
export const REMOVE_COMPONENT = 'REMOVE_COMPONENT'

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

export function removeComponentAction (id) {
  return {
    type: REMOVE_COMPONENT,
    serviceComponentId: id
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(loadAction())
  return fetch(__API_URL__ + 'components', {
    headers: { 'x-api-key': __API_KEY__ }
  }).then(response => response.json())
    .then(json => dispatch(listComponentsAction(json)))
    .catch(error => {
      console.error(error, error.stack)
    })
}

export const postComponent = (name, description, status) => {
  return dispatch => {
    dispatch(loadAction())
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(__API_URL__ + 'components', {
      headers: { 'X-api-key': __API_KEY__, 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(body)
    }).then(response => response.json())
      .then(json => dispatch(addComponentAction(json)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const updateComponent = (id, name, description, status) => {
  return dispatch => {
    dispatch(loadAction())
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(__API_URL__ + 'components/' + id, {
      headers: { 'X-api-key': __API_KEY__, 'Content-Type': 'application/json' },
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(response => response.json())
      .then(json => dispatch(editComponentAction(json)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const deleteComponent = (id) => {
  return dispatch => {
    dispatch(loadAction())
    return fetch(__API_URL__ + 'components/' + id, {
      headers: { 'X-api-key': __API_KEY__ },
      method: 'DELETE'
    }).then(response => dispatch(removeComponentAction(id)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const actions = {
  loadAction,
  listComponentsAction,
  addComponentAction,
  editComponentAction,
  removeComponentAction
}

// ------------------------------------
// Action Handlers
// ------------------------------------

function loadHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: true
  })
}

function listComponentsHandler (state = { }, action) {
  let components = JSON.parse(action.serviceComponents).map((component) => {
    return {
      id: component.ID,
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
        id: component.ID,
        name: component.name,
        description: component.description,
        status: component.status
      }
    ]
  })
}

function editComponentHandler (state = { }, action) {
  let editedComponent = JSON.parse(action.serviceComponent)
  state.serviceComponents.forEach((component) => {
    if (component.id === editedComponent.ID) {
      component.name = editedComponent.name
      component.description = editedComponent.description
      component.status = editedComponent.status
    }
  })

  return Object.assign({}, state, {
    isFetching: false,
    serviceComponents: state.serviceComponents
  })
}

function removeComponentHandler (state = { }, action) {
  let serviceComponents = state.serviceComponents.filter((component) => {
    return component.id !== action.serviceComponentId
  })

  return Object.assign({}, state, {
    isFetching: false,
    serviceComponents: serviceComponents
  })
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_COMPONENT]: addComponentHandler,
  [EDIT_COMPONENT]: editComponentHandler,
  [REMOVE_COMPONENT]: removeComponentHandler
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
