// ------------------------------------
// Constants
// ------------------------------------
export const LOAD = 'LOAD'
export const LIST_COMPONENTS = 'LIST_COMPONENTS'
export const ADD_COMPONENT = 'ADD_COMPONENT'
export const EDIT_COMPONENT = 'EDIT_COMPONENT_SUCCESS'

// ------------------------------------
// Actions
// ------------------------------------

export function load () {
  return {
    type: LOAD
  }
}

export function listComponents (json) {
  return {
    type: LIST_COMPONENTS,
    serviceComponents: json
  }
}

export function addComponent (json) {
  return {
    type: ADD_COMPONENT,
    serviceComponent: json
  }
}

export function editComponent (json) {
  return {
    type: EDIT_COMPONENT,
    serviceComponent: json
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(load())
  return fetch(__API_URL__ + 'components', {
    headers: { 'x-api-key': __API_KEY__ }
  }).then(response => response.json())
    .then(json => dispatch(listComponents(json)))
    .catch(error => {
      console.error(error, error.stack)
    })
}

export const postComponent = (name, description, status) => {
  return dispatch => {
    dispatch(load())
    let body = {
      name: name,
      description: description,
      status: status
    }
    return fetch(__API_URL__ + 'component', {
      headers: { method: 'POST', body: JSON.stringify(body), 'x-api-key': __API_KEY__ }
    }).then(response => response.json())
      .then(json => dispatch(addComponent(json)))
      .catch(error => {
        console.error(error, error.stack)
      })
  }
}

export const updateComponent = (id, name, description, status) => {}

export const actions = {
  load,
  listComponents,
  addComponent,
  editComponent
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
  return state
}

const ACTION_HANDLERS = {
  [LOAD]: loadHandler,
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_COMPONENT]: addComponentHandler,
  [EDIT_COMPONENT]: editComponentHandler
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
