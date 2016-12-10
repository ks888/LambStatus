import { GET_USER } from 'actions/users'

function getUserHandler (state = {}, action) {
  return Object.assign({}, state, {
    user: action.user
  })
}

const ACTION_HANDLERS = {
  [GET_USER]: getUserHandler
}

export default function userReducer (state = {
  user: {}
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
