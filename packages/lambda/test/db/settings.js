import assert from 'assert'
import AWS from 'aws-sdk-mock'
import SettingsStore, { settingKeys, RawSettingsStore } from 'db/settings'
import { NotFoundError } from 'utils/errors'

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

    it('should return empty string if not found', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new NotFoundError() }

      const actual = await store.getServiceName()
      assert(actual === '')
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

  describe('getStatusPageURL', () => {
    it('should return the StatusPage URL', async () => {
      const url = 'test'
      const store = new SettingsStore()
      store.store.get = (key) => {
        assert(key === settingKeys.statusPageURL)
        return url
      }

      const actual = await store.getStatusPageURL()
      assert(url === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new Error() }

      let error
      try {
        await store.getStatusPageURL()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })

    it('should return empty string if not found', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new NotFoundError() }

      const actual = await store.getStatusPageURL()
      assert(actual === '')
    })
  })

  describe('setStatusPageURL', () => {
    it('should set the StatusPage URL', async () => {
      const url = 'test'
      const store = new SettingsStore()
      store.store.set = (key, value) => {
        assert(key === settingKeys.statusPageURL)
        assert(value === url)
        return value
      }

      const actual = await store.setStatusPageURL(url)
      assert(url === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.set = () => { throw new Error() }

      let error
      try {
        await store.setStatusPageURL()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })

  describe('getAdminPageURL', () => {
    it('should return the AdminPage URL', async () => {
      const url = 'test'
      const store = new SettingsStore()
      store.store.get = (key) => {
        assert(key === settingKeys.adminPageURL)
        return url
      }

      const actual = await store.getAdminPageURL()
      assert(url === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new Error() }

      let error
      try {
        await store.getAdminPageURL()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })

    it('should return empty string if not found', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new NotFoundError() }

      const actual = await store.getAdminPageURL()
      assert(actual === '')
    })
  })

  describe('setAdminPageURL', () => {
    it('should set the AdminPage URL', async () => {
      const url = 'test'
      const store = new SettingsStore()
      store.store.set = (key, value) => {
        assert(key === settingKeys.adminPageURL)
        assert(value === url)
        return value
      }

      const actual = await store.setAdminPageURL(url)
      assert(url === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.set = () => { throw new Error() }

      let error
      try {
        await store.setAdminPageURL()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })
  })

  describe('getCognitoPoolID', () => {
    it('should return the CognitoPool ID', async () => {
      const id = 'test'
      const store = new SettingsStore()
      store.store.get = (key) => {
        assert(key === settingKeys.cognitoPoolID)
        return id
      }

      const actual = await store.getCognitoPoolID()
      assert(id === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new Error() }

      let error
      try {
        await store.getCognitoPoolID()
      } catch (err) {
        error = err
      }
      assert(error !== undefined)
    })

    it('should return empty string if not found', async () => {
      const store = new SettingsStore()
      store.store.get = () => { throw new NotFoundError() }

      const actual = await store.getCognitoPoolID()
      assert(actual === '')
    })
  })

  describe('setCognitoPoolID', () => {
    it('should set the CognitoPool ID', async () => {
      const id = 'test'
      const store = new SettingsStore()
      store.store.set = (key, value) => {
        assert(key === settingKeys.cognitoPoolID)
        assert(value === id)
        return value
      }

      const actual = await store.setCognitoPoolID(id)
      assert(id === actual)
    })

    it('should pass through throwed error', async () => {
      const store = new SettingsStore()
      store.store.set = () => { throw new Error() }

      let error
      try {
        await store.setCognitoPoolID()
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
})
