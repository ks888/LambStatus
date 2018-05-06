import assert from 'assert'
import { MaintenanceUpdate, Maintenance } from 'model/maintenances'
import { maintenanceStatuses } from 'utils/const'

describe('Maintenance', () => {
  const generateConstructorParams = () => {
    return {
      name: 'test',
      status: maintenanceStatuses[0],
      startAt: '2017-09-02T07:15:50.634Z',
      endAt: '2017-09-03T07:15:50.634Z',
      createdAt: '2017-09-01T07:15:50.634Z',
      updatedAt: '2017-09-01T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams()
      const maint = new Maintenance(params)

      assert(maint.name === params.name)
      assert(maint.startAt === params.startAt)
      assert(maint.endAt === params.endAt)
      assert(maint.createdAt === params.createdAt)
      assert(maint.updatedAt === params.updatedAt)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams()
      params.createdAt = undefined
      params.updatedAt = undefined

      const maint = new Maintenance(params)
      assert(maint.createdAt !== undefined)
      assert(maint.updatedAt !== undefined)
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.maintenanceID = '1'

      let error
      try {
        maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when maintenanceID is invalid', async () => {
      const params = generateConstructorParams('')
      const maintenance = new Maintenance(params)

      let error
      try {
        maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('validateExceptEventID', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)

      let error
      try {
        maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when name is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.name = ''

      let error
      try {
        await maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.status = 'test'

      let error
      try {
        await maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when startAt is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.startAt = ''

      let error
      try {
        await maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when endAt is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.endAt = ''

      let error
      try {
        await maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when createdAt is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.createdAt = ''

      let error
      try {
        await maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
      assert(error.message.match(/createdAt/))
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.updatedAt = ''

      let error
      try {
        await maintenance.validateExceptEventID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
      assert(error.message.match(/updatedAt/))
    })
  })
})

describe('MaintenanceUpdate', () => {
  const generateConstructorParams = (maintenanceID, maintenanceUpdateID) => {
    return {
      maintenanceID,
      maintenanceUpdateID,
      maintenanceStatus: maintenanceStatuses[0],
      message: 'test',
      createdAt: '2017-09-02T07:15:50.634Z',
      updatedAt: '2017-09-02T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams('1', '1')
      const maintenanceUpdate = new MaintenanceUpdate(params)

      assert(maintenanceUpdate.maintenanceID === params.maintenanceID)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams('1', '1')
      params.message = undefined
      params.updatedAt = undefined

      const maintenanceUpdate = new MaintenanceUpdate(params)
      assert(maintenanceUpdate.message === '')
      assert(maintenanceUpdate.updatedAt !== undefined)
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams('1', '1')
      const maintenance = new MaintenanceUpdate(params)

      let error
      try {
        maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when maintenance update id is invalid', async () => {
      const params = generateConstructorParams('1')
      const maintenance = new MaintenanceUpdate(params)

      let error
      try {
        maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('validateExceptEventUpdateID', async () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams('1')
      const maintenanceUpdate = new MaintenanceUpdate(params)

      let err
      try {
        maintenanceUpdate.validateExceptEventUpdateID()
      } catch (e) {
        err = e
      }
      assert(err === undefined)
    })

    it('should return error when maintenanceID is invalid', async () => {
      const params = generateConstructorParams('')
      const maintenanceUpdate = new MaintenanceUpdate(params)

      let error
      try {
        maintenanceUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when maintenanceStatus is invalid', async () => {
      const params = generateConstructorParams('1')
      const maintenanceUpdate = new MaintenanceUpdate(params)
      maintenanceUpdate.maintenanceStatus = 'test'

      let error
      try {
        maintenanceUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when message is invalid', async () => {
      const params = generateConstructorParams('1')
      const maintenanceUpdate = new MaintenanceUpdate(params)
      maintenanceUpdate.message = undefined

      let error
      try {
        maintenanceUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when createdAt is invalid', async () => {
      const params = generateConstructorParams('1')
      const maintenanceUpdate = new MaintenanceUpdate(params)
      maintenanceUpdate.createdAt = ''

      let error
      try {
        maintenanceUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams('1')
      const maintenanceUpdate = new MaintenanceUpdate(params)
      maintenanceUpdate.updatedAt = ''

      let error
      try {
        maintenanceUpdate.validateExceptEventUpdateID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })
})
