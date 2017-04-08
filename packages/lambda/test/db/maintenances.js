import assert from 'assert'
import AWS from 'aws-sdk-mock'
import MaintenancesStore from 'db/maintenances'

describe('MaintenancesStore', () => {
  describe('getAll', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a list of maintenances', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{maintenanceID: '1', name: '', status: '', startAt: '', endAt: '', updatedAt: ''}]})
      })
      const maints = await new MaintenancesStore().getAll()
      assert(maints.length === 1)
      assert(maints[0].maintenanceID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().getAll()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('getByID', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a maintenance', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: [{maintenanceID: '1', name: '', status: '', startAt: '', endAt: '', updatedAt: ''}]})
      })
      const maints = await new MaintenancesStore().getByID('1')
      assert(maints.length === 1)
      assert(maints[0].maintenanceID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().getByID()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the maintenance', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          maintenanceID: '1',
          name: params.ExpressionAttributeValues[':n'],
          status: params.ExpressionAttributeValues[':s'],
          startAt: params.ExpressionAttributeValues[':startAt'],
          endAt: params.ExpressionAttributeValues[':endAt'],
          updatedAt: params.ExpressionAttributeValues[':updatedAt'],
          updating: params.ExpressionAttributeValues[':updating']
        }})
      })
      const maint = await new MaintenancesStore().update('1', 'name', 'status', 'startAt', 'endAt', 'updatedAt', false)
      assert(maint.maintenanceID === '1')
      assert(maint.name === 'name')
      assert(maint.status === 'status')
      assert(maint.startAt === 'startAt')
      assert(maint.endAt === 'endAt')
      assert(maint.updatedAt === 'updatedAt')
      assert(maint.updating === false)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenancesStore().update('1', '', '', '', '')
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
