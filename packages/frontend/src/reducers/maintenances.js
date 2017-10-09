import { LIST_MAINTENANCES, LIST_MAINTENANCE_UPDATES, ADD_MAINTENANCE, EDIT_MAINTENANCE,
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

function listMaintenanceUpdatesHandler (state = { }, action) {
  const maintenanceUpdates = action.maintenanceUpdates
  maintenanceUpdates.sort((a, b) => {
    return a.createdAt < b.createdAt
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
  } = action.response

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
  } = action.response

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
  [LIST_MAINTENANCE_UPDATES]: listMaintenanceUpdatesHandler,
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
