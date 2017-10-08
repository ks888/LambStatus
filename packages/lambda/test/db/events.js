import assert from 'assert'
import AWS from 'aws-sdk-mock'
import EventsStore from 'db/events'

describe('EventsStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should query events', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        actual = params
        callback(null, {Items: [{}]})
      })
      const store = new EventsStore()
      store.getTableName = () => 'table1'
      store.getAttributeNames = () => ['key1', 'key2', 'attr1']
      store.createEvent = (item) => item

      const events = await store.query()
      assert(events.length === 1)
      assert(actual.TableName === 'table1')
      assert(actual.ProjectionExpression === '#key1, #key2, #attr1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })
      const store = new EventsStore()
      store.getTableName = () => ''
      store.getAttributeNames = () => []

      let error
      try {
        await store.query()
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

    it('should return a event', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        actual = params
        callback(null, {Item: {}})
      })
      const store = new EventsStore()
      store.getTableName = () => 'table1'
      store.getPartitionKeyName = () => 'key1'
      store.createEvent = (item) => item

      const event = await store.get('1')
      assert(event !== undefined)
      assert(actual.TableName === 'table1')
      assert(actual.Key['key1'] === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })
      const store = new EventsStore()
      store.getTableName = () => ''
      store.getPartitionKeyName = () => ''

      let error
      try {
        await store.get()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })

    it('should throw NotFoundError if there is no item', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {})
      })
      const store = new EventsStore()
      store.getTableName = () => ''
      store.getPartitionKeyName = () => ''

      let error
      try {
        await store.get()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })
  })

  describe('create', () => {
    it('should generate event id', async () => {
      const store = new EventsStore()
      store.setID = (item) => { item.ID = 1 }
      store.update = (item) => item

      const actual = await store.create({})
      assert(actual.ID === 1)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the event', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        actual = params
        callback(null, {Attributes: {}})
      })
      const store = new EventsStore()
      store.getAttributesExceptKeys = (item) => { return {attr1: 1} }
      store.getKeys = (item) => { return {key1: 1} }
      store.getTableName = () => 'table1'
      store.createEvent = (item) => item

      const event = await store.update({})
      assert(event !== undefined)
      assert(actual.Key.key1 === 1)
      assert(actual.ExpressionAttributeNames['#attr1'] === 'attr1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      const store = new EventsStore()
      store.getAttributesExceptKeys = (item) => { return {} }
      store.getKeys = (item) => { return {} }
      store.getTableName = () => ''

      let error
      try {
        await store.update({})
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

    it('should delete the event', async () => {
      let deletedID
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        deletedID = params.Key['key1']
        callback(null)
      })

      const store = new EventsStore()
      store.getTableName = () => 'table1'
      store.getPartitionKeyName = () => 'key1'

      await store.delete('1')
      assert(deletedID === '1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        callback('Error')
      })

      const store = new EventsStore()
      store.getTableName = () => 'table1'
      store.getPartitionKeyName = () => 'key1'

      let error
      try {
        await store.delete('1')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
