import { LIST_SETTINGS, EDIT_SETTINGS } from 'actions/settings'

function listSettingsHandler (state = { }, action) {
  return Object.assign({}, state, {
    settings: JSON.parse(action.settings)
  })
}

function editSettingsHandler (state = { }, action) {
  return Object.assign({}, state, {
    settings: JSON.parse(action.settings)
  })
}

const ACTION_HANDLERS = {
  [LIST_SETTINGS]: listSettingsHandler,
  [EDIT_SETTINGS]: editSettingsHandler
}

export default function settingsReducer (state = {
  settings: {}
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
