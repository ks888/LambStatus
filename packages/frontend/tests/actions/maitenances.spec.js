import fetchMock from 'fetch-mock'
import {
  LIST_MAINTENANCES,
  LIST_MAINTENANCE_UPDATES,
  ADD_MAINTENANCE,
  EDIT_MAINTENANCE,
  REMOVE_MAINTENANCE,
  fetchMaintenances,
  fetchMaintenanceUpdates,
  postMaintenance,
  updateMaintenance,
  deleteMaintenance
} from 'actions/maintenances'

describe('Actions/Maintenances', () => {
  const maintenance = { maintenanceID: '1' }
  const maintenanceUpdate = { maintenanceUpdateID: '1' }
  let dispatchSpy, callbacks

  beforeEach(() => {
    dispatchSpy = sinon.spy(() => {})
    callbacks = {
      onLoad: sinon.spy(),
      onSuccess: sinon.spy(),
      onFailure: sinon.spy()
    }
  })

  afterEach(() => {
    fetchMock.restore()
  })

  describe('fetchMaintenances', () => {
    it('should return a function.', () => {
      assert(typeof fetchMaintenances() === 'function')
    })

    it('should fetch maintenances.', async () => {
      fetchMock.get(/.*\/maintenances/, { body: [maintenance], headers: {'Content-Type': 'application/json'} })

      await fetchMaintenances(callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === LIST_MAINTENANCES)
      assert.deepEqual([maintenance], dispatchSpy.firstCall.args[0].maintenances)
    })

    it('should handle error properly.', async () => {
      fetchMock.get(/.*\/maintenances/, { status: 400, body: {} })

      await fetchMaintenances(callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('fetchMaintenanceUpdates', () => {
    it('should return a function.', () => {
      assert(typeof fetchMaintenanceUpdates() === 'function')
    })

    it('should fetch maintenances.', async () => {
      fetchMock.get(/.*\/maintenances\/.*\/maintenanceupdates/,
                    { body: [maintenanceUpdate], headers: {'Content-Type': 'application/json'} })

      await fetchMaintenanceUpdates('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === LIST_MAINTENANCE_UPDATES)
      assert.deepEqual([maintenanceUpdate], dispatchSpy.firstCall.args[0].maintenanceUpdates)
      assert(dispatchSpy.firstCall.args[0].maintenanceID === 'id')
    })

    it('should handle error properly.', async () => {
      fetchMock.get(/.*\/maintenances\/.*\/maintenanceupdates/, { status: 400, body: {} })

      await fetchMaintenanceUpdates('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('postMaintenance', () => {
    it('should return a function.', () => {
      assert(typeof postMaintenance() === 'function')
    })

    it('should post a new maintenance.', async () => {
      fetchMock.post(/.*\/maintenances/, { body: [maintenance], headers: {'Content-Type': 'application/json'} })

      await postMaintenance(undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === ADD_MAINTENANCE)
      assert.deepEqual([maintenance], dispatchSpy.firstCall.args[0].response)
    })

    it('should handle error properly.', async () => {
      fetchMock.post(/.*\/maintenances/, { status: 400, body: {} })

      await postMaintenance(undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('updateMaintenance', () => {
    it('should return a function.', () => {
      assert(typeof updateMaintenance() === 'function')
    })

    it('should post a new maintenance.', async () => {
      fetchMock.patch(/.*\/maintenances\/.*/,
                      { body: [maintenance], headers: {'Content-Type': 'application/json'} })

      await updateMaintenance('id', undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === EDIT_MAINTENANCE)
      assert.deepEqual([maintenance], dispatchSpy.firstCall.args[0].response)
    })

    it('should handle error properly.', async () => {
      fetchMock.patch(/.*\/maintenances\/.*/, { status: 400, body: {} })

      await updateMaintenance('id', undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('deleteMaintenance', () => {
    it('should return a function.', () => {
      assert(typeof deleteMaintenance() === 'function')
    })

    it('should post a new maintenance.', async () => {
      fetchMock.delete(/.*\/maintenances\/.*/, 204)

      await deleteMaintenance('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === REMOVE_MAINTENANCE)
      assert.deepEqual('id', dispatchSpy.firstCall.args[0].maintenanceID)
    })

    it('should handle error properly.', async () => {
      fetchMock.delete(/.*\/maintenances\/.*/, { status: 400, body: {} })

      await deleteMaintenance('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })
})
