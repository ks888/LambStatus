import assert from 'assert'
import AWS from 'aws-sdk-mock'
import APIGateway from 'aws/apiGateway'

describe('APIGateway', () => {
  afterEach(() => {
    AWS.restore('APIGateway')
  })

  context('deploy', () => {
    it('should deploy the resources', async () => {
      AWS.mock('APIGateway', 'createDeployment', (params, callback) => {
        callback(null)
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.deploy('id', 'name')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'createDeployment', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.deploy('id', 'name')
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('getApiKeys', () => {
    it('should returns the list of api keys', async () => {
      const expect = ['token']
      AWS.mock('APIGateway', 'getApiKeys', (params, callback) => {
        callback(null, {items: expect})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.getApiKeys('name')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert.deepEqual(actual, expect)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'getApiKeys', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.getApiKeys()
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('getApiKey', () => {
    it('should returns the api key', async () => {
      const id = 'id'
      AWS.mock('APIGateway', 'getApiKey', (params, callback) => {
        callback(null, {id: params.apiKey})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.getApiKey(id)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual.id, id)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'getApiKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.getApiKey()
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('createApiKey', () => {
    it('should create the new key', async () => {
      const name = 'key name'
      AWS.mock('APIGateway', 'createApiKey', (params, callback) => {
        callback(null, {name: params.name, enabled: params.enabled})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.createApiKey(name)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert.deepEqual(actual.name, name)
      assert(actual.enabled)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'createApiKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.createApiKey()
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('disableApiKey', () => {
    it('should disable the existing key', async () => {
      const expect = 'id'
      let actualParams
      AWS.mock('APIGateway', 'updateApiKey', (params, callback) => {
        actualParams = params
        callback(null)
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.disableApiKey(expect)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actualParams.apiKey === expect)
      assert(actualParams.patchOperations.length === 1)
      assert(actualParams.patchOperations[0].path === '/enabled')
      assert(actualParams.patchOperations[0].value === 'false')
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'updateApiKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.disableApiKey()
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('deleteApiKey', () => {
    it('should delete the existing key', async () => {
      const id = 'id'
      let actualID
      AWS.mock('APIGateway', 'deleteApiKey', (params, callback) => {
        actualID = params.apiKey
        callback(null)
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.deleteApiKey(id)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actualID === id)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'deleteApiKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.deleteApiKey()
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })
})
