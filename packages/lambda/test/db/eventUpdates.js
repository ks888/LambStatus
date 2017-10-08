import assert from 'assert'
import AWS from 'aws-sdk-mock'
import EventUpdatesStore from 'db/eventUpdates'

describe('EventUpdatesStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return event updates', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        actual = params
        callback(null, {Items: [{}]})
      })
      const store = new EventUpdatesStore()
      store.getTableName = () => 'table1'
      store.getPartitionKeyName = () => 'key1'
      store.getAttributeNames = () => ['key1', 'key2', 'attr1']
      store.createEventUpdate = (item) => item

      const eventUpdates = await store.query('1')
      assert(eventUpdates.length === 1)
      assert(actual.TableName === 'table1')
      assert(actual.KeyConditionExpression.match(/key1/))
      assert(actual.ProjectionExpression === 'key1, key2, attr1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback('Error')
      })

      const store = new EventUpdatesStore()
      store.getTableName = () => ''
      store.getPartitionKeyName = () => ''
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

  describe('create', () => {
    it('should generate update id', async () => {
      const store = new EventUpdatesStore()
      store.setUpdateID = (item) => { item.updateID = 1 }
      store.update = (item) => item

      const actual = await store.create({})
      assert(actual.updateID === 1)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the event update', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        actual = params
        callback(null, {Attributes: {}})
      })
      const store = new EventUpdatesStore()
      store.getAttributesExceptKeys = (item) => { return {attr1: 1} }
      store.getKeys = (item) => { return {key1: 1} }
      store.getTableName = () => 'table1'
      store.createEventUpdate = (item) => item

      const updatedEvent = await store.update({})
      assert(updatedEvent !== undefined)
      assert(actual.Key.key1 === 1)
      assert(actual.ExpressionAttributeNames['#attr1'] === 'attr1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      const store = new EventUpdatesStore()
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

    it('should delete the event update', async () => {
      let deletedIDs
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        deletedIDs = params.RequestItems['table1'].map(req => req.DeleteRequest.Key)
        callback(null)
      })

      const store = new EventUpdatesStore()
      store.getTableName = () => 'table1'
      store.getPartitionKeyName = () => 'key1'
      store.getSortKeyName = () => 'key2'

      await store.delete('1', ['1', '2'])
      assert(deletedIDs.length === 2)
      assert(deletedIDs[0].key1 === '1')
      assert(deletedIDs[0].key2 === '1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        callback('Error')
      })

      const store = new EventUpdatesStore()
      store.getTableName = () => 'table1'
      store.getPartitionKeyName = () => 'key1'
      store.getSortKeyName = () => 'key2'

      let error
      try {
        await store.delete('1', [])
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('getAttributeNames', () => {
    it('should return names of all attributes', async () => {
      const store = new EventUpdatesStore()
      store.getPartitionKeyName = () => 'key1'
      store.getSortKeyName = () => 'key2'
      store.getAttributeNamesExceptKeys = () => ['attr1']

      const attrs = store.getAttributeNames()
      assert(attrs.length === 3)
      assert(attrs[0] === 'key1')
      assert(attrs[1] === 'key2')
      assert(attrs[2] === 'attr1')
    })
  })

  describe('getKeys', () => {
    it('should return all key names', async () => {
      const store = new EventUpdatesStore()
      store.getPartitionKeyName = () => 'key1'
      store.getSortKeyName = () => 'key2'

      const keys = store.getKeys({key1: 1, key2: 2})
      assert(keys['key1'] === 1)
      assert(keys['key2'] === 2)
    })
  })

  describe('getAttributesExceptKeys', () => {
    it('should return all key names', async () => {
      const store = new EventUpdatesStore()
      store.getAttributeNamesExceptKeys = () => ['attr1']

      const keys = store.getAttributesExceptKeys({key1: 1, key2: 2, attr1: 3})
      assert(keys['attr1'] === 3)
    })
  })
})
