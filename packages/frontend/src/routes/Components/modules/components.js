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
    type: REQUEST_COMPONENTS
  }
}

export function receiveComponents (json) {
  return {
    type: RECEIVE_COMPONENTS,
    serviceComponents: json
  }
}

export const fetchComponents = (dispatch) => {
  dispatch(requestComponents())
  return fetch(__API_URL__ + 'components', {
    headers: { 'x-api-key': __API_KEY__ }
  }).then(response => response.json())
    .then(json => dispatch(receiveComponents(json)))
    .catch(error => {
      console.error(error, error.stack)
    })
}

export const actions = {
  requestComponents,
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
    serviceComponents: action.serviceComponents
  })
}

const ACTION_HANDLERS = {
  [REQUEST_COMPONENTS]: requestComponentsHandler,
  [RECEIVE_COMPONENTS]: receiveComponentsHandler
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
