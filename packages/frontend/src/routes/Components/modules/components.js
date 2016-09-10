// ------------------------------------
// Constants
// ------------------------------------
export const REQUEST_COMPONENTS = 'REQUEST_COMPONENTS'
export const RECEIVE_COMPONENTS = 'RECEIVE_COMPONENTS'
// ------------------------------------
// Actions
// ------------------------------------

export function requestComponents () {
  return {
    type: REQUEST_COMPONENTS,
    payload: value
  }
}

export function receiveComponents (json) {
  return {
    type: RECEIVE_COMPONENTS,
    components: []
  }
}

export const fetchComponents = () => {
  return (dispatch) => {
    dispatch(requestComponents())
    return fetch('https://dummy')
      .then(response => response.json())
      .then(json => dispatch(receiveComponents(json)))
  }
}

export const actions = {
  fetchComponents,
  receiveComponents
}

// ------------------------------------
// Action Handlers
// ------------------------------------

function requestComponentsHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: true
  })
}

function receiveComponentsHandler (state = { }, action) {
  return Object.assign({}, state, {
    isFetching: false,
    components: action.components
  })
}

const ACTION_HANDLERS = {
  [REQUEST_COMPONENTS]: requestComponentsHandler,
  [RECEIVE_COMPONENTS]: receiveComponentsHandler
}

// ------------------------------------
// Reducer
// ------------------------------------

export default function componentsReducer (state, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
