import { listMaintenances, listMaintenanceUpdates, addMaintenance, editMaintenance,
  removeMaintenance } from 'actions/maintenances'
import maintenancesReducer from 'reducers/maintenances'

describe('(Reducer) maintenances', () => {
  const maintenance1 = {
    maintenanceID: '1',
    name: 'name1',
    status: 'status1',
    updatedAt: ''
  }
  const maintenanceUpdate1 = {
    maintenanceUpdateID: '1',
    maintenanceStatus: 'status1',
    message: 'message1',
    updatedAt: ''
  }
  const maintenance2 = {
    maintenanceID: '2',
    name: 'name2',
    status: 'status2',
    updatedAt: ''
  }

  describe('listMaintenancesHandler', () => {
    it('Should update the `maintenances` state.', () => {
      const state = maintenancesReducer(undefined, listMaintenances(JSON.stringify([maintenance1])))
      assert.deepEqual([maintenance1], state.maintenances)
    })
  })

  describe('listMaintenanceUpdatesHandler', () => {
    it('Should update the `maintenances` state.', () => {
      const state = maintenancesReducer({maintenances: [maintenance1]},
        listMaintenanceUpdates(JSON.stringify([maintenanceUpdate1]), '1'))
      assert.deepEqual([Object.assign({}, maintenance1, {
        maintenanceUpdates: [maintenanceUpdate1]
      })], state.maintenances)
    })
  })

  describe('addMaintenanceHandler', () => {
    it('Should update the `maintenances` state.', () => {
      const state = maintenancesReducer({maintenances: [maintenance1]}, addMaintenance(JSON.stringify({maintenance: maintenance2})))
      assert.deepEqual([maintenance2, maintenance1], state.maintenances)
    })
  })

  describe('editMaintenanceHandler', () => {
    it('Should update the `maintenances` state.', () => {
      const newMaintenance1 = Object.assign({}, maintenance1, {
        name: 'newname'
      })
      const state = maintenancesReducer({maintenances: [maintenance1]}, editMaintenance(JSON.stringify({maintenance: newMaintenance1})))
      assert.deepEqual([newMaintenance1], state.maintenances)
    })
  })

  describe('removeMaintenanceHandler', () => {
    it('Should delete the `maintenances` state.', () => {
      const state = maintenancesReducer({maintenances: [maintenance1]}, removeMaintenance('1'))
      assert.deepEqual([], state.maintenances)
    })
  })
})
