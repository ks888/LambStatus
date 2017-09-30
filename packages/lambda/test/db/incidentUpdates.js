import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import { IncidentUpdate } from 'model/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { IncidentUpdateTable } from 'utils/const'

describe('IncidentUpdatesStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a incident update', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: [{
          incidentID: '1', incidentUpdateID: '1'
        }]})
      })
      const incidentUpdates = await new IncidentUpdatesStore().query('1')
      assert(incidentUpdates.length === 1)
      assert(incidentUpdates[0] instanceof IncidentUpdate)
      assert(incidentUpdates[0].incidentID === '1')
      assert(incidentUpdates[0].incidentUpdateID === '1')
      assert(incidentUpdates[0].message === '')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentUpdatesStore().query()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('create', () => {
    it('should generate incident update id', async () => {
      const store = new IncidentUpdatesStore()
      store.update = sinon.spy()

      await store.create(new IncidentUpdate({}))
      assert(store.update.calledOnce)
      assert(store.update.firstCall.args[0].incidentUpdateID.length === 12)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the incident update', async () => {
      const params = {
        incidentID: '1',
        incidentUpdateID: '1',
        incidentStatus: 'status',
        message: '',
        updatedAt: 'updatedAt'
      }
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          incidentID: params.Key.incidentID,
          incidentUpdateID: params.Key.incidentUpdateID,
          incidentStatus: params.ExpressionAttributeValues[':incidentStatus'],
          message: params.ExpressionAttributeValues[':message'],
          updatedAt: params.ExpressionAttributeValues[':updatedAt']
        }})
      })

      const incidentUpdate = await new IncidentUpdatesStore().update(new IncidentUpdate(params))
      assert(incidentUpdate instanceof IncidentUpdate)
      assert(incidentUpdate.incidentID === params.incidentID)
      assert(incidentUpdate.incidentUpdateID === params.incidentUpdateID)
      assert(incidentUpdate.incidentStatus === params.incidentStatus)
      assert(incidentUpdate.message === params.message)
      assert(incidentUpdate.updatedAt === params.updatedAt)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentUpdatesStore().update({})
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

    it('should delete the incident update', async () => {
      let deletedIDs
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        deletedIDs = params.RequestItems[IncidentUpdateTable].map(req => req.DeleteRequest.Key)
        callback(null)
      })
      await new IncidentUpdatesStore().delete('1', ['1', '2'])
      assert(deletedIDs.length === 2)
      assert(deletedIDs[0].incidentID === '1')
      assert(deletedIDs[0].incidentUpdateID === '1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentUpdatesStore().delete('1', [])
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
