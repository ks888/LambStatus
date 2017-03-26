import fetchMock from 'fetch-mock'
import {
  LIST_INCIDENTS,
  LIST_INCIDENT_UPDATES,
  ADD_INCIDENT,
  EDIT_INCIDENT,
  REMOVE_INCIDENT,
  fetchIncidents,
  fetchIncidentUpdates,
  postIncident,
  updateIncident,
  deleteIncident
} from 'actions/incidents'

describe('(Action) incidents', () => {
  const incident1 = {
    incidentID: 'id'
  }

  const incidentUpdate1 = {
    incidentUpdateID: 'id'
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

  describe('fetchIncidents', () => {
    it('Should return a function.', () => {
      assert(typeof fetchIncidents() === 'function')
    })

    it('Should fetch incidents.', () => {
      fetchMock.get(/.*\/incidents/, { body: [incident1], headers: {'Content-Type': 'application/json'} })

      return fetchIncidents(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_INCIDENTS)
          assert.deepEqual([incident1], dispatchSpy.firstCall.args[0].incidents)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.get(/.*\/incidents/, { status: 400, body: {} })

      return fetchIncidents(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('fetchIncidentUpdates', () => {
    it('Should return a function.', () => {
      assert(typeof fetchIncidentUpdates() === 'function')
    })

    it('Should fetch incidents.', () => {
      fetchMock.get(/.*\/incidents\/.*\/incidentupdates/,
                    { body: [incidentUpdate1], headers: {'Content-Type': 'application/json'} })

      return fetchIncidentUpdates('id', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_INCIDENT_UPDATES)
          assert.deepEqual([incidentUpdate1], dispatchSpy.firstCall.args[0].incidentUpdates)
          assert(dispatchSpy.firstCall.args[0].incidentID === 'id')
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.get(/.*\/incidents\/.*\/incidentupdates/, { status: 400, body: {} })

      return fetchIncidentUpdates('id', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('postIncident', () => {
    it('Should return a function.', () => {
      assert(typeof postIncident() === 'function')
    })

    it('Should post a new incident.', () => {
      fetchMock.post(/.*\/incidents/, { body: [incident1], headers: {'Content-Type': 'application/json'} })

      return postIncident(undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === ADD_INCIDENT)
          assert.deepEqual([incident1], dispatchSpy.firstCall.args[0].response)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.post(/.*\/incidents/, { status: 400, body: {} })

      return postIncident(undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('updateIncident', () => {
    it('Should return a function.', () => {
      assert(typeof updateIncident() === 'function')
    })

    it('Should post a new incident.', () => {
      fetchMock.patch(/.*\/incidents\/.*/,
                      { body: [incident1], headers: {'Content-Type': 'application/json'} })

      return updateIncident('id', undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === EDIT_INCIDENT)
          assert.deepEqual([incident1], dispatchSpy.firstCall.args[0].response)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.patch(/.*\/incidents\/.*/, { status: 400, body: {} })

      return updateIncident('id', undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('deleteIncident', () => {
    it('Should return a function.', () => {
      assert(typeof deleteIncident() === 'function')
    })

    it('Should post a new incident.', () => {
      fetchMock.delete(/.*\/incidents\/.*/, 204)

      return deleteIncident('id', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === REMOVE_INCIDENT)
          assert.deepEqual('id', dispatchSpy.firstCall.args[0].incidentID)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.delete(/.*\/incidents\/.*/, { status: 400, body: {} })

      return deleteIncident('id', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })
})
