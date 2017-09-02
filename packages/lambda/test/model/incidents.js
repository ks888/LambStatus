import assert from 'assert'
import sinon from 'sinon'
import { Incidents, Incident } from 'model/incidents'
import { Component } from 'model/components'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import ComponentsStore from 'db/components'
import { incidentStatuses } from 'utils/const'

describe('Incident', () => {
  const generateConstructorParams = (incidentID) => {
    return {
      incidentID,
      name: 'test',
      status: incidentStatuses[0],
      message: 'test',
      components: [],
      updatedAt: '2017-09-02T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams('1')
      const incident = new Incident(params)

      assert(incident.incidentID === params.incidentID)
      assert(incident.name === params.name)
      assert(incident.status === params.status)
      assert(incident.message === params.message)
      assert(incident.components.length === params.components.length)
      assert(incident.updatedAt === params.updatedAt)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams()
      params.message = undefined
      params.updatedAt = undefined

      const incident = new Incident(params)
      assert(incident.incidentID.length === 12)
      assert(incident.message === '')
      assert(incident.updatedAt !== undefined)
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when incidentID is invalid', async () => {
      const params = generateConstructorParams('')
      const incident = new Incident(params)

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when incidentID does not exist', async () => {
      sinon.stub(IncidentsStore.prototype, 'getByID').returns([])

      const params = generateConstructorParams('1')
      const incident = new Incident(params)

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')

      IncidentsStore.prototype.getByID.restore()
    })

    it('should return error when name is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.name = ''

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.status = 'test'

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when message is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.message = undefined

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when components is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.components = ''

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when components validation failed', async () => {
      const params = generateConstructorParams()
      params.components = [new Component({componentID: ''})]
      const incident = new Incident(params)

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.updatedAt = ''

      let error
      try {
        await incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
      assert(error.message.match(/updatedAt/))
    })
  })

  describe('save', () => {
    afterEach(() => {
      IncidentsStore.prototype.update.restore()
      IncidentUpdatesStore.prototype.update.restore()
      ComponentsStore.prototype.updateStatus.restore()
    })

    it('should updates incident, incidentUpdates, and components', async () => {
      const incidentStoreStub = sinon.stub(IncidentsStore.prototype, 'update').returns()
      const incidentUpdateStoreStub = sinon.stub(IncidentUpdatesStore.prototype, 'update').returns()
      const compStoreStub = sinon.stub(ComponentsStore.prototype, 'updateStatus').returns()

      const params = generateConstructorParams('1')
      params.components = [new Component({})]
      const incident = new Incident(params)
      await incident.save()

      assert(incidentStoreStub.calledOnce)
      assert(incidentStoreStub.firstCall.args[0].incidentID === params.incidentID)
      assert(incidentUpdateStoreStub.calledOnce)
      assert(incidentUpdateStoreStub.firstCall.args[0].incidentID === params.incidentID)
      assert(compStoreStub.calledOnce)
    })

    it('should throw error when updateStatus throws error', async () => {
      const incidentStoreStub = sinon.stub(IncidentsStore.prototype, 'update').returns()
      const incidentUpdateStoreStub = sinon.stub(IncidentUpdatesStore.prototype, 'update').returns()
      sinon.stub(ComponentsStore.prototype, 'updateStatus').throws()

      const params = generateConstructorParams()
      params.components = [new Component({})]
      const incident = new Incident(params)
      let error
      try {
        await incident.save()
      } catch (e) {
        error = e
      }
      assert(incidentStoreStub.calledOnce)
      assert(incidentUpdateStoreStub.calledOnce)
      assert(error.message.match(/Error/))
    })
  })
})

describe('Incidents', () => {
  describe('all', () => {
    afterEach(() => {
      IncidentsStore.prototype.getAll.restore()
    })

    it('should return a list of incidents', async () => {
      const rawIncidents = [{incidentID: 1}, {incidentID: 2}]
      sinon.stub(IncidentsStore.prototype, 'getAll').returns(rawIncidents)

      const incidents = await new Incidents().all()
      assert(incidents.length === 2)
      assert(incidents[0].incidentID === 1)
      assert(incidents[1].incidentID === 2)
    })

    it('should return error when the store throws exception', async () => {
      sinon.stub(IncidentsStore.prototype, 'getAll').throws()
      let error
      try {
        await new Incidents().all()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('lookup', () => {
    afterEach(() => {
      IncidentsStore.prototype.getByID.restore()
    })

    it('should return one incident', async () => {
      sinon.stub(IncidentsStore.prototype, 'getByID').returns([{incidentID: 1}])

      const incident = await new Incidents().lookup(1)
      assert(incident.incidentID === 1)
    })

    it('should return error when matched no incident', async () => {
      sinon.stub(IncidentsStore.prototype, 'getByID').returns([])
      let error
      try {
        await new Incidents().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should return error when matched multiple incidents', async () => {
      sinon.stub(IncidentsStore.prototype, 'getByID').returns([{incidentID: 1}, {incidentID: 1}])
      let error
      try {
        await new Incidents().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })
})

