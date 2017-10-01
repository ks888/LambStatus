import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import { Incident } from 'model/incidents'
import IncidentsStore from 'db/incidents'

describe('IncidentsStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should query incidents', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{incidentID: '1'}]})
      })
      const incidents = await new IncidentsStore().query()
      assert(incidents.length === 1)
      assert(incidents[0] instanceof Incident)
      assert(incidents[0].incidentID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentsStore().query()
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

    it('should return a incident', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {incidentID: '1'}})
      })
      const incident = await new IncidentsStore().get('1')
      assert(incident instanceof Incident)
      assert(incident.incidentID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentsStore().get()
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
        await new IncidentsStore().get()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })
  })

  describe('create', () => {
    it('should generate incident id', async () => {
      const store = new IncidentsStore()
      store.update = sinon.spy()

      await store.create(new Incident({}))
      assert(store.update.calledOnce)
      assert(store.update.firstCall.args[0].incidentID.length === 12)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the incident', async () => {
      const params = {
        incidentID: '1',
        name: 'test',
        status: 'status',
        updatedAt: 'updatedAt'
      }
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          incidentID: params.Key.incidentID,
          name: params.ExpressionAttributeValues[':n'],
          status: params.ExpressionAttributeValues[':s'],
          updatedAt: params.ExpressionAttributeValues[':updatedAt']
        }})
      })
      const incident = await new IncidentsStore().update(new Incident(params))
      assert(incident instanceof Incident)
      assert(incident.incidentID === incident.incidentID)
      assert(incident.name === incident.name)
      assert(incident.status === incident.status)
      assert(incident.updatedAt === incident.updatedAt)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentsStore().update(new Incident({}))
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

    it('should delete the incident', async () => {
      let deletedID
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        deletedID = params.Key.incidentID
        callback(null)
      })
      await new IncidentsStore().delete('1')
      assert(deletedID === '1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new IncidentsStore().delete('1')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
