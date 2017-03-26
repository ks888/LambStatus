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

describe('(Action) maintenances', () => {
  const maintenance1 = {
    maintenanceID: 'id'
  }

  const maintenanceUpdate1 = {
    maintenanceUpdateID: 'id'
  }

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
    it('Should return a function.', () => {
      assert(typeof fetchMaintenances() === 'function')
    })

    it('Should fetch maintenances.', async () => {
      fetchMock.get(/.*\/maintenances/, { body: [maintenance1], headers: {'Content-Type': 'application/json'} })

      await fetchMaintenances(callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === LIST_MAINTENANCES)
      assert.deepEqual([maintenance1], dispatchSpy.firstCall.args[0].maintenances)
    })

    it('Should handle error properly.', async () => {
      fetchMock.get(/.*\/maintenances/, { status: 400, body: {} })

      await fetchMaintenances(callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('fetchMaintenanceUpdates', () => {
    it('Should return a function.', () => {
      assert(typeof fetchMaintenanceUpdates() === 'function')
    })

    it('Should fetch maintenances.', async () => {
      fetchMock.get(/.*\/maintenances\/.*\/maintenanceupdates/,
                    { body: [maintenanceUpdate1], headers: {'Content-Type': 'application/json'} })

      await fetchMaintenanceUpdates('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === LIST_MAINTENANCE_UPDATES)
      assert.deepEqual([maintenanceUpdate1], dispatchSpy.firstCall.args[0].maintenanceUpdates)
      assert(dispatchSpy.firstCall.args[0].maintenanceID === 'id')
    })

    it('Should handle error properly.', async () => {
      fetchMock.get(/.*\/maintenances\/.*\/maintenanceupdates/, { status: 400, body: {} })

      await fetchMaintenanceUpdates('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('postMaintenance', () => {
    it('Should return a function.', () => {
      assert(typeof postMaintenance() === 'function')
    })

    it('Should post a new maintenance.', async () => {
      fetchMock.post(/.*\/maintenances/, { body: [maintenance1], headers: {'Content-Type': 'application/json'} })

      await postMaintenance(undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === ADD_MAINTENANCE)
      assert.deepEqual([maintenance1], dispatchSpy.firstCall.args[0].response)
    })

    it('Should handle error properly.', async () => {
      fetchMock.post(/.*\/maintenances/, { status: 400, body: {} })

      await postMaintenance(undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('updateMaintenance', () => {
    it('Should return a function.', () => {
      assert(typeof updateMaintenance() === 'function')
    })

    it('Should post a new maintenance.', async () => {
      fetchMock.patch(/.*\/maintenances\/.*/,
                      { body: [maintenance1], headers: {'Content-Type': 'application/json'} })

      await updateMaintenance('id', undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === EDIT_MAINTENANCE)
      assert.deepEqual([maintenance1], dispatchSpy.firstCall.args[0].response)
    })

    it('Should handle error properly.', async () => {
      fetchMock.patch(/.*\/maintenances\/.*/, { status: 400, body: {} })

      await updateMaintenance('id', undefined, undefined, undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('deleteMaintenance', () => {
    it('Should return a function.', () => {
      assert(typeof deleteMaintenance() === 'function')
    })

    it('Should post a new maintenance.', async () => {
      fetchMock.delete(/.*\/maintenances\/.*/, 204)

      await deleteMaintenance('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === REMOVE_MAINTENANCE)
      assert.deepEqual('id', dispatchSpy.firstCall.args[0].maintenanceID)
    })

    it('Should handle error properly.', async () => {
      fetchMock.delete(/.*\/maintenances\/.*/, { status: 400, body: {} })

      await deleteMaintenance('id', callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })
})
