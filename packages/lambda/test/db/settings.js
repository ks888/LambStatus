import assert from 'assert'
import AWS from 'aws-sdk-mock'
import SettingsStore, { settingKeys, RawSettingsStore } from 'db/settings'

describe('SettingsStore', () => {
  describe('getServiceName', () => {
    it('should return the service name', async () => {
      const serviceName = 'test'
      const store = new SettingsStore()
      store.store.get = (key) => {
        assert(key === settingKeys.serviceName)
        return serviceName
      }

      const actual = await store.getServiceName()
      assert(serviceName === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new Error() }

      let error
      try {
        await store.getServiceName()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })

  describe('setServiceName', () => {
    it('should set the service name', async () => {
      const serviceName = 'test'
      const store = new SettingsStore()
      store.store.set = (key, value) => {
        assert(key === settingKeys.serviceName)
        assert(value === serviceName)
        return value
      }

      const actual = await store.setServiceName(serviceName)
      assert(serviceName === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.set = () => { throw new Error() }

      let error
      try {
        await store.setServiceName()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })

  describe('getLogoID', () => {
    it('should return the logo ID', async () => {
      const id = 'test'
      const store = new SettingsStore()
      store.store.get = (key) => {
        assert(key === settingKeys.logoID)
        return id
      }

      const actual = await store.getLogoID()
      assert(id === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new Error() }

      let error
      try {
        await store.getLogoID()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })

  describe('setLogoID', () => {
    it('should set the Logo ID', async () => {
      const id = 'test'
      const store = new SettingsStore()
      store.store.set = (key, value) => {
        assert(key === settingKeys.logoID)
        assert(value === id)
        return value
      }

      const actual = await store.setLogoID(id)
      assert(id === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.set = () => { throw new Error() }

      let error
      try {
        await store.setLogoID()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })

  describe('deleteLogoID', () => {
    it('should delete the Logo ID', async () => {
      const id = 'test'
      const store = new SettingsStore()
      store.store.delete = (key) => {
        assert(key === settingKeys.logoID)
      }

      await store.deleteLogoID(id)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.delete = () => { throw new Error() }

      let error
      try {
        await store.deleteLogoID()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })
})

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
