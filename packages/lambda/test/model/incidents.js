import assert from 'assert'
import { Incident, IncidentUpdate } from 'model/incidents'
import { incidentStatuses } from 'utils/const'

describe('Incident', () => {
  const generateConstructorParams = () => {
    return {
      name: 'test',
      status: incidentStatuses[0],
      message: 'test',
      components: [],
      createdAt: '2017-09-02T07:15:50.634Z',
      updatedAt: '2017-09-02T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)

      assert(incident.name === params.name)
      assert(incident.status === params.status)
      assert(incident.createdAt === params.createdAt)
      assert(incident.updatedAt === params.updatedAt)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams()
      params.createdAt = undefined
      params.updatedAt = undefined

      const incident = new Incident(params)
      assert(incident.createdAt !== undefined)
      assert(incident.updatedAt !== undefined)
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.incidentID = '1'

      let error
      try {
        incident.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when name is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)

      let error
      try {
        incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('validateExceptEventID', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)

      let error
      try {
        incident.validateExceptEventID()
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
        incident.validateExceptEventID()
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
        incident.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when createdAt is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.createdAt = ''

      let error
      try {
        incident.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
      assert(error.message.match(/createdAt/))
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams()
      const incident = new Incident(params)
      incident.updatedAt = ''

      let error
      try {
        incident.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
      assert(error.message.match(/updatedAt/))
    })
  })
})

describe('IncidentUpdate', () => {
  const generateConstructorParams = (incidentID, incidentUpdateID) => {
    return {
      incidentID,
      incidentUpdateID,
      incidentStatus: incidentStatuses[0],
      message: 'test',
      createdAt: '2017-09-02T07:15:50.634Z',
      updatedAt: '2017-09-02T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams('1', '1')
      const incidentUpdate = new IncidentUpdate(params)

      assert(incidentUpdate.incidentID === params.incidentID)
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

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams('1', '1')
      const incident = new IncidentUpdate(params)

      let error
      try {
        incident.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when incident update id is invalid', async () => {
      const params = generateConstructorParams('1')
      const incident = new IncidentUpdate(params)

      let error
      try {
        incident.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('validateExceptEventUpdateID', async () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams('1')
      const incidentUpdate = new IncidentUpdate(params)
      let err
      try {
        incidentUpdate.validateExceptEventUpdateID()
      } catch (e) {
        err = e
      }
      assert(err === undefined)
    })

    it('should return error when incidentID is invalid', async () => {
      const params = generateConstructorParams('')
      const incidentUpdate = new IncidentUpdate(params)

      let error
      try {
        incidentUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const params = generateConstructorParams('1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.incidentStatus = 'test'

      let error
      try {
        incidentUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when message is invalid', async () => {
      const params = generateConstructorParams('1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.message = undefined

      let error
      try {
        incidentUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when createdAt is invalid', async () => {
      const params = generateConstructorParams('1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.createdAt = ''

      let error
      try {
        incidentUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams('1')
      const incidentUpdate = new IncidentUpdate(params)
      incidentUpdate.updatedAt = ''

      let error
      try {
        incidentUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })
})
