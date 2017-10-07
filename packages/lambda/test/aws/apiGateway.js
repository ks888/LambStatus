import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import APIGateway, { APIKey } from 'aws/apiGateway'
import { NotFoundError } from 'utils/errors'

// NotFoundException class is the mock of the exception the API Gateway SDK throws
class NotFoundException {
  constructor (message) {
    this.name = 'NotFoundException'
    this.message = message
  }
}

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

  context('queryEnabledApiKey', () => {
    it('should returns the list of enabled api keys', async () => {
      const expect = [{id: '1', enabled: true}, {id: '2', enabled: false}]
      AWS.mock('APIGateway', 'getApiKeys', (params, callback) => {
        callback(null, {items: expect})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.queryEnabledApiKey('name')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual.length === 1)
      assert(actual[0] instanceof APIKey)
      assert(actual[0].id === expect[0].id)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'getApiKeys', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.queryEnabledApiKey()
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
      assert(actual instanceof APIKey)
      assert(actual.id, id)
    })

    it('should throws the NotFoundError if the api key is not found', async () => {
      AWS.mock('APIGateway', 'getApiKey', (params, callback) => {
        callback(new NotFoundException())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.getApiKey('id')
      } catch (error) {
        err = error
      }

      assert(err.name === NotFoundError.name)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'getApiKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.getApiKey('id')
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('createApiKeyWithUsagePlan', () => {
    it('should call createApiKey and createUsagePlanKey', async () => {
      const apiGateway = new APIGateway('ap-northeast-1')
      const createApiKeyStub = sinon.stub(apiGateway, 'createApiKey').returns({id: 'id'})
      apiGateway.createUsagePlanKey = sinon.spy()

      await apiGateway.createApiKeyWithUsagePlan('name', 'id')

      assert(createApiKeyStub.calledOnce)
      assert(apiGateway.createUsagePlanKey.calledOnce)
    })
  })

  context('createApiKey', () => {
    it('should create the new key', async () => {
      const id = 'id'
      AWS.mock('APIGateway', 'createApiKey', (params, callback) => {
        callback(null, {id})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.createApiKey('name')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual.id === id)
      assert(actual instanceof APIKey)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'createApiKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.createApiKey('')
      } catch (error) {
        err = error
      }

      assert(err !== undefined)
    })
  })

  context('createUsagePlanKey', () => {
    it('should create the new usage plan key', async () => {
      const id = 'id'
      AWS.mock('APIGateway', 'createUsagePlanKey', (params, callback) => {
        callback(null, {id})
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err, actual
      try {
        actual = await apiGateway.createUsagePlanKey(id, '')
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual.id === id)
    })

    it('should throws the error if the API call failed', async () => {
      AWS.mock('APIGateway', 'createUsagePlanKey', (params, callback) => {
        callback(new Error())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.createUsagePlanKey('', '')
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

    it('should throws the NotFound error if key not found', async () => {
      AWS.mock('APIGateway', 'updateApiKey', (params, callback) => {
        callback(new NotFoundException())
      })
      const apiGateway = new APIGateway('ap-northeast-1')

      let err
      try {
        await apiGateway.disableApiKey('')
      } catch (error) {
        err = error
      }

      assert(err.name === NotFoundError.name)
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
