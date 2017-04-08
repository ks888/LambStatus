import assert from 'assert'
import sinon from 'sinon'
import { Maintenances, Maintenance } from 'model/maintenances'
import { Component } from 'model/components'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import ComponentsStore from 'db/components'

describe('Maintenance', () => {
  describe('constructor', () => {
    it('should construct a new instance', () => {
      const maint = new Maintenance('1', 'name', 'status', 'start', 'end', 'msg', [], 'upd')
      assert(maint.maintenanceID === '1')
      assert(maint.name === 'name')
      assert(maint.startAt === 'start')
      assert(maint.endAt === 'end')
      assert(maint.message === 'msg')
      assert.deepEqual([], maint.components)
      assert(maint.updatedAt === 'upd')
    })

    it('should fill in insufficient values', () => {
      const maint = new Maintenance(undefined, 'name', 'status', 'start', 'end', 'msg', [], undefined)
      assert(maint.maintenanceID.length === 12)
      assert(maint.updatedAt !== undefined)
    })
  })

  describe('validate', () => {
    const genMock = () => new Maintenance(undefined, 'name', 'Scheduled', '1', '2', 'msg', [], undefined)
    it('should return no error when input is valid', async () => {
      const maint = genMock()
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when maintenanceID is invalid', async () => {
      const maint = genMock()
      maint.maintenanceID = ''
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when maintenanceID does not exist', async () => {
      sinon.stub(MaintenancesStore.prototype, 'getByID').returns([])
      const maint = new Maintenance('1', 'name', 'status', 'start', 'end', 'msg', [], undefined)
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
      MaintenancesStore.prototype.getByID.restore()
    })

    it('should return error when name is invalid', async () => {
      const maint = genMock()
      maint.name = ''
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const maint = genMock()
      maint.status = 'st'
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when startAt is invalid', async () => {
      const maint = genMock()
      maint.startAt = ''
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when endAt is invalid', async () => {
      const maint = genMock()
      maint.endAt = ''
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when message is invalid', async () => {
      const maint = genMock()
      delete maint.startAt
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when components is invalid', async () => {
      const maint = genMock()
      maint.components = ''
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when components validation failed', async () => {
      const maint = genMock()
      maint.components = [new Component()]
      let error
      try {
        await maint.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('save', () => {
    afterEach(() => {
      MaintenancesStore.prototype.update.restore()
      MaintenanceUpdatesStore.prototype.update.restore()
      ComponentsStore.prototype.updateStatus.restore()
    })

    it('should updates maitenance, maintenaceUpdate, and components', async () => {
      const maintStoreStub = sinon.stub(MaintenancesStore.prototype, 'update').returns({})
      const maintUpdateStoreStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'update').returns({})
      const compStoreStub = sinon.stub(ComponentsStore.prototype, 'updateStatus').returns({})

      const maint = new Maintenance(undefined, '', '', '', '', '', [{}, {}], undefined)
      await maint.save()
      assert(maintStoreStub.calledOnce)
      assert(maintUpdateStoreStub.calledOnce)
      assert(compStoreStub.calledTwice)
    })

    it('should throw error when updateStatus throws error', async () => {
      const maintStoreStub = sinon.stub(MaintenancesStore.prototype, 'update').returns({})
      const maintUpdateStoreStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'update').returns({})
      sinon.stub(ComponentsStore.prototype, 'updateStatus').throws()

      const maint = new Maintenance(undefined, '', '', '', '', '', [{}, {}], undefined)
      let error
      try {
        await maint.save()
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

      const maint = await new Maintenances().lookup(1)
      assert(maint.maintenanceID === 1)
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

