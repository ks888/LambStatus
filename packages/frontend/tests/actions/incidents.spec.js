import fetchMock from 'fetch-mock'
import {
  LIST_INCIDENTS,
  LIST_INCIDENT_UPDATES,
  ADD_INCIDENT,
  EDIT_INCIDENT,
  EDIT_INCIDENT_UPDATE,
  REMOVE_INCIDENT,
  fetchIncidents,
  fetchIncidentUpdates,
  postIncident,
  updateIncident,
  updateIncidentUpdate,
  deleteIncident
} from 'actions/incidents'

describe('Actions/Incidents', () => {
  const incident = { incidentID: '1' }
  const incidentUpdate = { incidentUpdateID: '1' }
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
    it('should return a function.', () => {
      assert(typeof fetchIncidents() === 'function')
    })

    it('should fetch incidents.', () => {
      fetchMock.get(/.*\/incidents/, { body: [incident], headers: {'Content-Type': 'application/json'} })

      return fetchIncidents(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_INCIDENTS)
          assert.deepEqual([incident], dispatchSpy.firstCall.args[0].incidents)
        })
    })

    it('should handle error properly.', () => {
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
    it('should return a function.', () => {
      assert(typeof fetchIncidentUpdates() === 'function')
    })

    it('should fetch incidents.', () => {
      fetchMock.get(/.*\/incidents\/.*\/incidentupdates/,
                    { body: [incidentUpdate], headers: {'Content-Type': 'application/json'} })

      return fetchIncidentUpdates('id', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_INCIDENT_UPDATES)
          assert.deepEqual([incidentUpdate], dispatchSpy.firstCall.args[0].incidentUpdates)
          assert(dispatchSpy.firstCall.args[0].incidentID === 'id')
        })
    })

    it('should handle error properly.', () => {
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
    it('should return a function.', () => {
      assert(typeof postIncident({}) === 'function')
    })

    it('should post a new incident.', () => {
      fetchMock.post(/.*\/incidents/, { body: [incident], headers: {'Content-Type': 'application/json'} })

      return postIncident({}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === ADD_INCIDENT)
          assert.deepEqual([incident], dispatchSpy.firstCall.args[0].response)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.post(/.*\/incidents/, { status: 400, body: {} })

      return postIncident({}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('updateIncident', () => {
    it('should return a function.', () => {
      assert(typeof updateIncident({}) === 'function')
    })

    it('should update the existing incident.', () => {
      fetchMock.patch(/.*\/incidents\/.*/,
                      { body: [incident], headers: {'Content-Type': 'application/json'} })

      return updateIncident({incidentID: 'id'}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === EDIT_INCIDENT)
          assert.deepEqual([incident], dispatchSpy.firstCall.args[0].response)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.patch(/.*\/incidents\/.*/, { status: 400, body: {} })

      return updateIncident({incidentID: 'id'}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('updateIncidentUpdate', () => {
    it('should return a function.', () => {
      assert(typeof updateIncidentUpdate({}) === 'function')
    })

    it('should update the existing incident update.', () => {
      fetchMock.patch(/.*\/incidents\/.*\/incidentupdates\/.*/,
                      { body: incidentUpdate, headers: {'Content-Type': 'application/json'} })

      return updateIncidentUpdate({incidentID: 'id', incidentUpdateID: 'id'}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === EDIT_INCIDENT_UPDATE)
          assert.deepEqual(incidentUpdate, dispatchSpy.firstCall.args[0].response)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.patch(/.*\/incidents\/.*\/incidentupdates\/.*/, { status: 400, body: {} })

      return updateIncidentUpdate({incidentID: 'id', incidentUpdateID: 'id'}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('deleteIncident', () => {
    it('should return a function.', () => {
      assert(typeof deleteIncident() === 'function')
    })

    it('should post a new incident.', () => {
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

    it('should handle error properly.', () => {
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
