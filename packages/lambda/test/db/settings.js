import assert from 'assert'
import AWS from 'aws-sdk-mock'
import SettingsStore from 'db/settings'

describe('SettingsStore', () => {
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
      const setting = await new SettingsStore().get(key)
      assert(value === setting)
    })

    it('should throw NotFoundError if no associated key exists', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {})
      })

      let error
      try {
        await new SettingsStore().get('testkey')
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new SettingsStore().get('testkey')
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

    it('should update the component', async () => {
      const key = 'testkey'
      const value = 'testvalue'
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {key, value}})
      })
      const setting = await new SettingsStore().update(key, value)
      assert(value === setting)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new SettingsStore().update('', '')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
