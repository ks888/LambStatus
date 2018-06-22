import assert from 'assert'
import AWS from 'aws-sdk-mock'
import { RawSettingsStore } from 'db/settings'
import { SettingsTable } from 'utils/const'

describe('RawSettingsStore', () => {
  describe('get', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return the value associated with the given key', async () => {
      const key = 'testkey'
      const value = 'testvalue'
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {key, value}})
      })
      const setting = await new RawSettingsStore().get(key)
      assert(value === setting)
    })

    it('should throw NotFoundError if no associated key exists', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {})
      })

      let error
      try {
        await new RawSettingsStore().get('testkey')
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should return empty value if associated key is empty', async () => {
      const key = 'key'
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {key}})  // value is undefined when the actual value is empty
      })

      const setting = await new RawSettingsStore().get(key)
      assert(setting === '')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new RawSettingsStore().get('testkey')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('batchGet', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return the values associated with the given keys', async () => {
      const keys = [{key: 'key1'}, {key: 'key2'}]
      let actualParams
      AWS.mock('DynamoDB.DocumentClient', 'batchGet', (params, callback) => {
        actualParams = params
        callback(null, {
          Responses: {[SettingsTable]: [
            {key: 'key1', value: 'v1'},
            {key: 'key2', value: 'v2'}
          ]},
          UnprocessedKeys: {}
        })
      })

      const actual = await new RawSettingsStore().batchGet(keys.map(key => key.key))
      assert.deepEqual(keys, actualParams.RequestItems[SettingsTable].Keys)
      assert(actual.length === keys.length)
      assert(actual[0] === 'v1')
      assert(actual[1] === 'v2')
    })

    it('should return the empty value if the key not matched', async () => {
      const keys = [{key: 'key1'}]
      let actualParams
      AWS.mock('DynamoDB.DocumentClient', 'batchGet', (params, callback) => {
        actualParams = params
        callback(null, {Responses: {[SettingsTable]: []}, UnprocessedKeys: {}})
      })

      const actual = await new RawSettingsStore().batchGet(keys.map(key => key.key))
      assert.deepEqual(keys, actualParams.RequestItems[SettingsTable].Keys)
      assert(actual.length === keys.length)
      assert(actual[0] === '')
    })

    it('should return the empty value if the key does not have a value', async () => {
      const keys = [{key: 'key1'}]
      let actualParams
      AWS.mock('DynamoDB.DocumentClient', 'batchGet', (params, callback) => {
        actualParams = params
        callback(null, {Responses: {[SettingsTable]: keys}, UnprocessedKeys: {}})
      })

      const actual = await new RawSettingsStore().batchGet(keys.map(key => key.key))
      assert.deepEqual(keys, actualParams.RequestItems[SettingsTable].Keys)
      assert(actual.length === keys.length)
      assert(actual[0] === '')
    })

    it('should return error if there are unprocessed keys', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'batchGet', (params, callback) => {
        callback(null, {Responses: {}, UnprocessedKeys: {Keys: []}})
      })

      let err
      try {
        await new RawSettingsStore().batchGet([])
      } catch (error) {
        err = error
      }
      assert(err !== undefined)
    })
  })

  describe('set', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should set the component', async () => {
      const key = 'testkey'
      const value = 'testvalue'
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {key, value}})
      })
      const setting = await new RawSettingsStore().set(key, value)
      assert(value === setting)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new RawSettingsStore().set('', '')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('batchSet', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return the values associated with the given keys', async () => {
      const items = {key1: 'v1', key2: 'v2'}
      let actualParams
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        actualParams = params
        callback(null, {UnprocessedItems: {}})
      })

      await new RawSettingsStore().batchSet(items)
      const requestedItems = actualParams.RequestItems[SettingsTable].map(r => r.PutRequest.Item)
      assert(Object.keys(items).length === requestedItems.length)
      assert(requestedItems[0].key === 'key1')
      assert(requestedItems[0].value === 'v1')
    })

    it('should return error if there are unprocessed items', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
        callback(null, {Responses: {}, UnprocessedItems: {PutRequest: {}}})
      })

      let err
      try {
        await new RawSettingsStore().batchSet([])
      } catch (error) {
        err = error
      }
      assert(err !== undefined)
    })
  })

  describe('delete', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should delete the logo id', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        assert(params.Key.key === '1')
        callback(null)
      })
      await new RawSettingsStore().delete('1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new RawSettingsStore().delete('1')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
