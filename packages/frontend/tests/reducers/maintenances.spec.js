import { listMaintenances, listMaintenance, addMaintenance, editMaintenance,
         editMaintenanceUpdate, removeMaintenance } from 'actions/maintenances'
import maintenancesReducer from 'reducers/maintenances'

describe('Reducers/maintenances', () => {
  const maintenance1 = {
    maintenanceID: '1',
    name: 'name1',
    status: 'status1',
    createdAt: '1'
  }
  const maintenanceUpdate1 = {
    maintenanceID: '1',
    maintenanceUpdateID: '1',
    maintenanceStatus: 'status1',
    message: 'message1',
    createdAt: '1'
  }
  const maintenance2 = {
    maintenanceID: '2',
    name: 'name2',
    status: 'status2',
    createdAt: '2'
  }

  describe('listMaintenancesHandler', () => {
    it('should update the maintenances.', () => {
      const state = maintenancesReducer(undefined, listMaintenances([maintenance1]))
      assert.deepEqual([maintenance1], state.maintenances)
    })

    it('should sort the maintenances.', () => {
      const state = maintenancesReducer(undefined, listMaintenances([maintenance1, maintenance2]))
      assert.deepEqual([maintenance2, maintenance1], state.maintenances)
    })
  })

  describe('listMaintenanceHandler', () => {
    it('should update the maintenance updates.', () => {
      const maintenance = {
        ...maintenance1,
        maintenanceUpdates: [maintenanceUpdate1]
      }
      const state = maintenancesReducer({maintenances: [maintenance1]},
                                        listMaintenance(maintenance, maintenance1.maintenanceID))
      assert(state.maintenances.length === 1)
      assert(state.maintenances[0].maintenanceUpdates.length === 1)
      assert.deepEqual(state.maintenances[0].maintenanceUpdates[0], maintenanceUpdate1)
    })

    it('should sort the maintenance updates.', () => {
      const maintenance = {
        ...maintenance1,
        maintenanceUpdates: [maintenanceUpdate1, {...maintenanceUpdate1, maintenanceUpdateID: '2', createdAt: '2'}]
      }
      const state = maintenancesReducer({maintenances: [maintenance1]},
                                        listMaintenance(maintenance, maintenance1.maintenanceID))
      assert(state.maintenances.length === 1)
      assert(state.maintenances[0].maintenanceUpdates.length === 2)
      assert(state.maintenances[0].maintenanceUpdates[0].maintenanceUpdateID === '2')
    })
  })

  describe('addMaintenanceHandler', () => {
    it('should add the new maintenance.', () => {
      const state = maintenancesReducer({maintenances: [maintenance1]}, addMaintenance(maintenance2))
      assert.deepEqual([maintenance2, maintenance1], state.maintenances)
    })
  })

  describe('editMaintenanceHandler', () => {
    it('should update the `maintenances` state.', () => {
      const newName = 'newName'
      const newMaintenance = { ...maintenance1, name: newName }
      const state = maintenancesReducer({maintenances: [maintenance1]}, editMaintenance(newMaintenance))
      assert.deepEqual([newMaintenance], state.maintenances)
    })
  })

  describe('editMaintenanceUpdateHandler', () => {
    it('should update the maintenance update.', () => {
      const existingMaintenance = {...maintenance1, maintenanceUpdates: [maintenanceUpdate1]}
      const newMaintenanceUpdate = {...maintenanceUpdate1, message: 'new'}
      const state = maintenancesReducer({maintenances: [existingMaintenance]},
                                        editMaintenanceUpdate(newMaintenanceUpdate))
      assert(state.maintenances[0].maintenanceUpdates[0].message === 'new')
    })
  })

  describe('removeMaintenanceHandler', () => {
    it('should delete the `maintenances` state.', () => {
      const state = maintenancesReducer({maintenances: [maintenance1]}, removeMaintenance('1'))
      assert(state.maintenances.length === 0)
    })
  })
})
