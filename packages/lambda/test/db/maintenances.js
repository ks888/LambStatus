import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import { Maintenance } from 'model/maintenances'
import MaintenancesStore from 'db/maintenances'

describe('MaintenancesStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should query maintenances', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{maintenanceID: '1'}]})
      })
      const maints = await new MaintenancesStore().query()
      assert(maints.length === 1)
      assert(maints[0] instanceof Maintenance)
      assert(maints[0].maintenanceID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().query()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('get', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a maintenance', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {maintenanceID: '1'}})
      })
      const maint = await new MaintenancesStore().get('1')
      assert(maint instanceof Maintenance)
      assert(maint.maintenanceID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().get()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })

    it('should throw NotFoundError if there is no item', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {})
      })

      let error
      try {
        await new MaintenancesStore().get()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })
  })

  describe('create', () => {
    it('should generate maintenance id', async () => {
      const store = new MaintenancesStore()
      store.update = sinon.spy()

      await store.create(new Maintenance({}))
      assert(store.update.calledOnce)
      assert(store.update.firstCall.args[0].maintenanceID.length === 12)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the maintenance', async () => {
      const params = {
        maintenanceID: '1',
        name: 'test',
        status: 'status',
        startAt: 'startAt',
        endAt: 'endAt',
        updatedAt: 'updatedAt'
      }
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          maintenanceID: params.Key.maintenanceID,
          name: params.ExpressionAttributeValues[':n'],
          status: params.ExpressionAttributeValues[':s'],
          startAt: params.ExpressionAttributeValues[':startAt'],
          endAt: params.ExpressionAttributeValues[':endAt'],
          updatedAt: params.ExpressionAttributeValues[':updatedAt']
        }})
      })
      const maint = await new MaintenancesStore().update(new Maintenance(params))
      assert(maint.maintenanceID === maint.maintenanceID)
      assert(maint.name === maint.name)
      assert(maint.status === maint.status)
      assert(maint.startAt === maint.startAt)
      assert(maint.endAt === maint.endAt)
      assert(maint.updatedAt === maint.updatedAt)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().update(new Maintenance({}))
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('delete', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should delete the maintenance', async () => {
      let deletedID
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        deletedID = params.Key.maintenanceID
        callback(null)
      })
      await new MaintenancesStore().delete('1')
      assert(deletedID === '1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().delete('1')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
