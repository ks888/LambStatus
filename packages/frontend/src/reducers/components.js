import { LIST_COMPONENTS, ADD_COMPONENT, EDIT_COMPONENT, REMOVE_COMPONENT } from 'actions/components'

function listComponentsHandler (state = { }, action) {
  return Object.assign({}, state, {
    components: JSON.parse(action.components)
  })
}

function addComponentHandler (state = { }, action) {
  return Object.assign({}, state, {
    components: [
      ...state.components,
      JSON.parse(action.component)
    ]
  })
}

function editComponentHandler (state = { }, action) {
  let editedComponent = JSON.parse(action.component)

  const newComponents = state.components.map((component) => {
    if (component.componentID === editedComponent.componentID) {
      return Object.assign({}, component, editedComponent)
    }
    return component
  })

  newComponents.sort((a, b) => a.order - b.order)

  return Object.assign({}, state, {
    components: newComponents
  })
}

function removeComponentHandler (state = { }, action) {
  let components = state.components.filter((component) => {
    return component.componentID !== action.componentID
  })

  return Object.assign({}, state, {
    components
  })
}

const ACTION_HANDLERS = {
  [LIST_COMPONENTS]: listComponentsHandler,
  [ADD_COMPONENT]: addComponentHandler,
  [EDIT_COMPONENT]: editComponentHandler,
  [REMOVE_COMPONENT]: removeComponentHandler
}

export default function componentsReducer (state = {
  components: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
