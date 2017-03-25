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

fetchMock = fetchMock.mock({headers: {'Content-Type': 'application/json'}})

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
      expect(fetchIncidents()).to.be.a('function')
    })

    it('Should fetch incidents.', () => {
      fetchMock.get(/.*\/incidents/, { body: [incident1] })

      return fetchIncidents(callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(LIST_INCIDENTS)
          expect(dispatchSpy.firstCall.args[0].incidents).to.deep.equal([incident1])
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.get(/.*\/incidents/, { status: 400, body: {} })

      return fetchIncidents(callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('fetchIncidentUpdates', () => {
    it('Should return a function.', () => {
      expect(fetchIncidentUpdates()).to.be.a('function')
    })

    it('Should fetch incidents.', () => {
      fetchMock.get(/.*\/incidents\/.*\/incidentupdates/, { body: [incidentUpdate1] })

      return fetchIncidentUpdates('id', callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(LIST_INCIDENT_UPDATES)
          expect(dispatchSpy.firstCall.args[0].incidentUpdates).to.deep.equal([incidentUpdate1])
          expect(dispatchSpy.firstCall.args[0].incidentID).to.equal('id')
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.get(/.*\/incidents\/.*\/incidentupdates/, { status: 400, body: {} })

      return fetchIncidentUpdates('id', callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('postIncident', () => {
    it('Should return a function.', () => {
      expect(postIncident()).to.be.a('function')
    })

    it('Should post a new incident.', () => {
      fetchMock.post(/.*\/incidents/, { body: [incident1] })

      return postIncident(undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(ADD_INCIDENT)
          expect(dispatchSpy.firstCall.args[0].response).to.deep.equal([incident1])
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.post(/.*\/incidents/, { status: 400, body: {} })

      return postIncident(undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('updateIncident', () => {
    it('Should return a function.', () => {
      expect(updateIncident()).to.be.a('function')
    })

    it('Should post a new incident.', () => {
      fetchMock.patch(/.*\/incidents\/.*/, { body: [incident1] })

      return updateIncident('id', undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(EDIT_INCIDENT)
          expect(dispatchSpy.firstCall.args[0].response).to.deep.equal([incident1])
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.patch(/.*\/incidents\/.*/, { status: 400, body: {} })

      return updateIncident('id', undefined, undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('deleteIncident', () => {
    it('Should return a function.', () => {
      expect(deleteIncident()).to.be.a('function')
    })

    it('Should post a new incident.', () => {
      fetchMock.delete(/.*\/incidents\/.*/, { body: [incident1] })

      return deleteIncident('id', callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(REMOVE_INCIDENT)
          expect(dispatchSpy.firstCall.args[0].incidentID).to.deep.equal('id')
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.delete(/.*\/incidents\/.*/, { status: 400, body: {} })

      return deleteIncident('id', callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })
})
