import assert from 'assert'
import AWS from 'aws-sdk-mock'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { MaintenanceUpdateTable } from 'utils/const'

describe('MaintenanceUpdatesStore', () => {
  describe('getByMaintenanceID', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a maintenance update', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: [{
          maintenanceID: '1', maintenanceUpdateID: '1', maintenanceStatus: '', updatedAt: ''
        }]})
      })
      const maints = await new MaintenanceUpdatesStore().getByMaintenanceID('1')
      assert(maints.length === 1)
      assert(maints[0].maintenanceID === '1')
      assert(maints[0].maintenanceUpdateID === '1')
      assert(maints[0].message === '')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenanceUpdatesStore().getByMaintenanceID()
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

    it('should update the maintenance update', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          maintenanceID: '1',
          maintenanceUpdateID: '1',
          maintenanceStatus: params.ExpressionAttributeValues[':maintenanceStatus'],
          message: params.ExpressionAttributeValues[':message'],
          updatedAt: params.ExpressionAttributeValues[':updatedAt']
        }})
      })
      const maint = await new MaintenanceUpdatesStore().update('1', 'status', 'message', 'updatedAt')
      assert(maint.maintenanceID === '1')
      assert(maint.maintenanceUpdateID === '1')
      assert(maint.maintenanceStatus === 'status')
      assert(maint.message === 'message')
      assert(maint.updatedAt === 'updatedAt')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenanceUpdatesStore().update('1', '', '', '')
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

    it('should delete the maintenance update', async () => {
      let deletedIDs
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        deletedIDs = params.RequestItems[MaintenanceUpdateTable].map(req => req.DeleteRequest.Key)
        callback(null)
      })
      await new MaintenanceUpdatesStore().delete('1', ['1', '2'])
      assert(deletedIDs.length === 2)
      assert(deletedIDs[0].maintenanceID === '1')
      assert(deletedIDs[0].maintenanceUpdateID === '1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MaintenanceUpdatesStore().delete('1', [])
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
