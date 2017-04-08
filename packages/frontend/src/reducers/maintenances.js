import { LIST_MAINTENANCES, LIST_MAINTENANCE_UPDATES, ADD_MAINTENANCE, EDIT_MAINTENANCE,
  REMOVE_MAINTENANCE } from 'actions/maintenances'

function listMaintenancesHandler (state = { }, action) {
  const maintenances = JSON.parse(action.maintenances)
  maintenances.sort((a, b) => {
    return a.updatedAt < b.updatedAt
  })

  return Object.assign({}, state, {
    maintenances: maintenances
  })
}

function listMaintenanceUpdatesHandler (state = { }, action) {
  const maintenanceUpdates = JSON.parse(action.maintenanceUpdates)
  maintenanceUpdates.sort((a, b) => {
    return a.updatedAt < b.updatedAt
  })

  const newMaintenances = state.maintenances.map((maintenance) => {
    if (maintenance.maintenanceID === action.maintenanceID) {
      return Object.assign({}, maintenance, {
        maintenanceUpdates: maintenanceUpdates
      })
    }
    return maintenance
  })

  return Object.assign({}, state, {
    maintenances: newMaintenances
  })
}

function addMaintenanceHandler (state = { }, action) {
  const {
    maintenance
  } = JSON.parse(action.response)

  return Object.assign({}, state, {
    maintenances: [
      maintenance,
      ...state.maintenances
    ]
  })
}

function editMaintenanceHandler (state = { }, action) {
  const {
    maintenance: updatedMaintenance
  } = JSON.parse(action.response)

  const newMaintenances = state.maintenances.map((maintenance) => {
    if (maintenance.maintenanceID === updatedMaintenance.maintenanceID) {
      return updatedMaintenance
    }
    return maintenance
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
  [LIST_MAINTENANCE_UPDATES]: listMaintenanceUpdatesHandler,
  [ADD_MAINTENANCE]: addMaintenanceHandler,
  [EDIT_MAINTENANCE]: editMaintenanceHandler,
  [REMOVE_MAINTENANCE]: removeMaintenanceHandler
}

export default function maintenancesReducer (state = {
  maintenances: []
}, action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
