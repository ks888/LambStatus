import { LIST_MAINTENANCES, LIST_MAINTENANCE, ADD_MAINTENANCE, EDIT_MAINTENANCE,
         EDIT_MAINTENANCE_UPDATE, REMOVE_MAINTENANCE } from 'actions/maintenances'

function listMaintenancesHandler (state = { }, action) {
  const maintenances = action.maintenances
  maintenances.sort((a, b) => {
    return a.createdAt < b.createdAt
  })

  return Object.assign({}, state, {
    maintenances: maintenances
  })
}

function listMaintenanceHandler (state = { }, action) {
  action.maintenance.maintenanceUpdates.sort((a, b) => {
    return a.createdAt < b.createdAt
  })

  const newMaintenances = state.maintenances.map((maintenance) => {
    if (maintenance.maintenanceID === action.maintenanceID) {
      return action.maintenance
    }
    return maintenance
  })

  return Object.assign({}, state, {
    maintenances: newMaintenances
  })
}

function addMaintenanceHandler (state = { }, action) {
  delete action.response.components

  return Object.assign({}, state, {
    maintenances: [
      action.response,
      ...state.maintenances
    ]
  })
}

function editMaintenanceHandler (state = { }, action) {
  delete action.response.components

  const newMaintenances = state.maintenances.map((maintenance) => {
    if (maintenance.maintenanceID === action.response.maintenanceID) {
      return action.response
    }
    return maintenance
  })

  return Object.assign({}, state, {
    maintenances: newMaintenances
  })
}

function editMaintenanceUpdateHandler (state = { }, action) {
  const updatedMaintenanceUpdate = action.response

  const newMaintenances = state.maintenances.map((maintenance) => {
    if (maintenance.maintenanceID !== updatedMaintenanceUpdate.maintenanceID) {
      return maintenance
    }

    const newMaintenanceUpdates = maintenance.maintenanceUpdates.map((maintenanceUpdate) => {
      if (maintenanceUpdate.maintenanceUpdateID !== updatedMaintenanceUpdate.maintenanceUpdateID) {
        return maintenanceUpdate
      }
      return updatedMaintenanceUpdate
    })
    return {...maintenance, maintenanceUpdates: newMaintenanceUpdates}
  })

  return Object.assign({}, state, {
    maintenances: newMaintenances
  })
}

function removeMaintenanceHandler (state = { }, action) {
  const newMaintenances = state.maintenances.filter((maintenance) => {
    return maintenance.maintenanceID !== action.maintenanceID
  })

  return Object.assign({}, state, {
    maintenances: newMaintenances
  })
}

const ACTION_HANDLERS = {
  [LIST_MAINTENANCES]: listMaintenancesHandler,
  [LIST_MAINTENANCE]: listMaintenanceHandler,
  [ADD_MAINTENANCE]: addMaintenanceHandler,
  [EDIT_MAINTENANCE]: editMaintenanceHandler,
  [EDIT_MAINTENANCE_UPDATE]: editMaintenanceUpdateHandler,
  [REMOVE_MAINTENANCE]: removeMaintenanceHandler
}

export default function maintenancesReducer (state = {
  maintenances: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
