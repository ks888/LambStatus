import assert from 'assert'
import { Incident, IncidentUpdate } from 'model/incidents'
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
      assert(incident.updatedAt === params.updatedAt)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams()
      params.updatedAt = undefined

      const incident = new Incident(params)
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

  /*
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
*/
})

describe('IncidentUpdate', () => {
  const generateConstructorParams = (incidentID, incidentUpdateID) => {
    return {
      incidentID,
      incidentUpdateID,
      incidentStatus: incidentStatuses[0],
      message: 'test',
      updatedAt: '2017-09-02T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams('1', '1')
      const incidentUpdate = new IncidentUpdate(params)

      assert(incidentUpdate.incidentID === params.incidentID)
      assert(incidentUpdate.incidentUpdateID === params.incidentUpdateID)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams('1', '1')
      params.message = undefined
      params.updatedAt = undefined

      const incidentUpdate = new IncidentUpdate(params)
      assert(incidentUpdate.message === '')
      assert(incidentUpdate.updatedAt !== undefined)
    })
  })

  describe('validate', async () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams('1', '1')
      const incidentUpdate = new IncidentUpdate(params)
      let err
      try {
        await incidentUpdate.validate()
      } catch (e) {
        err = e
      }
      assert(err === undefined)
    })

    it('should return error when incidentID is invalid', async () => {
      const params = generateConstructorParams('', '1')
      const incidentUpdate = new IncidentUpdate(params)

      let error
      try {
        await incidentUpdate.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const params = generateConstructorParams('1', '1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.incidentStatus = 'test'

      let error
      try {
        await incidentUpdate.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when message is invalid', async () => {
      const params = generateConstructorParams('1', '1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.message = undefined

      let error
      try {
        await incidentUpdate.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams('1', '1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.updatedAt = ''

      let error
      try {
        await incidentUpdate.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })
})
