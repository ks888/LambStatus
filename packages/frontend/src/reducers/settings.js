import { LIST_SETTINGS, EDIT_SETTINGS, ADD_API_KEY, REMOVE_API_KEY } from 'actions/settings'

function listSettingsHandler (state = { }, action) {
  action.settings.apiKeys.sort((a, b) => a.createdDate > b.createdDate)

  return Object.assign({}, state, {
    settings: action.settings
  })
}

function editSettingsHandler (state = { }, action) {
  action.settings.apiKeys.sort((a, b) => a.createdDate > b.createdDate)

  return Object.assign({}, state, {
    settings: action.settings
  })
}

function addApiKeyHandler (state = { }, action) {
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      apiKeys: [...state.settings.apiKeys, action.apiKey]
    }
  })
}

function removeApiKeyHandler (state = { }, action) {
  return Object.assign({}, state, {
    settings: {
      ...state.settings,
      apiKeys: state.settings.apiKeys.filter(key => key.id !== action.keyID)
    }
  })
}

const ACTION_HANDLERS = {
  [LIST_SETTINGS]: listSettingsHandler,
  [EDIT_SETTINGS]: editSettingsHandler,
  [ADD_API_KEY]: addApiKeyHandler,
  [REMOVE_API_KEY]: removeApiKeyHandler
}

export default function settingsReducer (state = {
  settings: {}
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
