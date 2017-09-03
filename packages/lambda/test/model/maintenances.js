import assert from 'assert'
import sinon from 'sinon'
import { Maintenances, Maintenance } from 'model/maintenances'
import { Component } from 'model/components'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import ComponentsStore from 'db/components'
import { maintenanceStatuses } from 'utils/const'

describe('Maintenance', () => {
  const generateConstructorParams = (maintenanceID) => {
    return {
      maintenanceID,
      name: 'test',
      status: maintenanceStatuses[0],
      startAt: '2017-09-02T07:15:50.634Z',
      endAt: '2017-09-03T07:15:50.634Z',
      message: '',
      components: [],
      updatedAt: '2017-09-01T07:15:50.634Z'
    }
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams('1')
      const maint = new Maintenance(params)

      assert(maint.maintenanceID === params.maintenanceID)
      assert(maint.name === params.name)
      assert(maint.startAt === params.startAt)
      assert(maint.endAt === params.endAt)
      assert(maint.message === params.message)
      assert(maint.components.length === params.components.length)
      assert(maint.updatedAt === params.updatedAt)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams()
      params.message = undefined
      params.updatedAt = undefined

      const maint = new Maintenance(params)
      assert(maint.maintenanceID.length === 12)
      assert(maint.message === '')
      assert(maint.updatedAt !== undefined)
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)

      let error
      try {
        await maintenance.validate()
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
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when maintenanceID does not exist', async () => {
      sinon.stub(MaintenancesStore.prototype, 'getByID').returns([])

      const params = generateConstructorParams('1')
      const maintenance = new Maintenance(params)

      let error
      try {
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
      MaintenancesStore.prototype.getByID.restore()
    })

    it('should return error when name is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.name = ''

      let error
      try {
        await maintenance.validate()
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
        await maintenance.validate()
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
        await maintenance.validate()
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
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when message is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.message = undefined

      let error
      try {
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when components is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.components = ''

      let error
      try {
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when components validation failed', async () => {
      const params = generateConstructorParams()
      params.components = [new Component({componentID: ''})]
      const maintenance = new Maintenance(params)

      let error
      try {
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when updatedAt is invalid', async () => {
      const params = generateConstructorParams()
      const maintenance = new Maintenance(params)
      maintenance.updatedAt = ''

      let error
      try {
        await maintenance.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
      assert(error.message.match(/updatedAt/))
    })
  })

  describe('save', () => {
    afterEach(() => {
      MaintenancesStore.prototype.update.restore()
      MaintenanceUpdatesStore.prototype.update.restore()
      ComponentsStore.prototype.updateStatus.restore()
    })

    it('should updates maitenance, maintenaceUpdate, and components', async () => {
      const maintStoreStub = sinon.stub(MaintenancesStore.prototype, 'update').returns()
      const maintUpdateStoreStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'update').returns()
      const compStoreStub = sinon.stub(ComponentsStore.prototype, 'updateStatus').returns()

      const params = generateConstructorParams('1')
      params.components = [new Component({})]
      const maintenance = new Maintenance(params)
      await maintenance.save()

      assert(maintStoreStub.calledOnce)
      assert(maintStoreStub.firstCall.args[0].maintenanceID === params.maintenanceID)
      assert(maintUpdateStoreStub.calledOnce)
      assert(maintUpdateStoreStub.firstCall.args[0].maintenanceID === params.maintenanceID)
      assert(compStoreStub.calledOnce)
    })

    it('should throw error when updateStatus throws error', async () => {
      const maintStoreStub = sinon.stub(MaintenancesStore.prototype, 'update').returns()
      const maintUpdateStoreStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'update').returns()
      sinon.stub(ComponentsStore.prototype, 'updateStatus').throws()

      const params = generateConstructorParams()
      params.components = [new Component({})]
      const maintenance = new Maintenance(params)
      let error
      try {
        await maintenance.save()
      } catch (e) {
        error = e
      }

      assert(maintStoreStub.calledOnce)
      assert(maintUpdateStoreStub.calledOnce)
      assert(error.message.match(/Error/))
    })
  })
})

describe('Maintenances', () => {
  describe('all', () => {
    afterEach(() => {
      MaintenancesStore.prototype.getAll.restore()
    })

    it('should return a list of maintenances', async () => {
      const maintenances = [{maintenanceID: 1}, {maintenanceID: 2}]
      sinon.stub(MaintenancesStore.prototype, 'getAll').returns(maintenances)

      const maints = await new Maintenances().all()
      assert(maints.length === 2)
      assert(maints[0].maintenanceID === 1)
      assert(maints[1].maintenanceID === 2)
    })

    it('should return error when the store throws exception', async () => {
      sinon.stub(MaintenancesStore.prototype, 'getAll').throws()
      let error
      try {
        await new Maintenances().all()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('lookup', () => {
    afterEach(() => {
      MaintenancesStore.prototype.getByID.restore()
    })

    it('should return one maintenance', async () => {
      sinon.stub(MaintenancesStore.prototype, 'getByID').returns([{maintenanceID: 1}])

      const maintenance = await new Maintenances().lookup(1)
      assert(maintenance.maintenanceID === 1)
    })

    it('should return error when matched no maintenance', async () => {
      sinon.stub(MaintenancesStore.prototype, 'getByID').returns([])
      let error
      try {
        await new Maintenances().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should return error when matched multiple maintenances', async () => {
      sinon.stub(MaintenancesStore.prototype, 'getByID').returns([{maintenanceID: 1}, {maintenanceID: 1}])
      let error
      try {
        await new Maintenances().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })
})

