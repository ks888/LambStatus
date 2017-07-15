import assert from 'assert'
import sinon from 'sinon'
import SNS from 'aws/sns'
import CloudFormation from 'aws/cloudFormation'
import { Settings, ApiKey } from 'model/settings'
import SettingsStore from 'db/settings'
import APIGateway from 'aws/apiGateway'
import { NotFoundError } from 'utils/errors'
import * as constants from 'utils/const'

// NotFoundException class is the mock of the exception the API Gateway may throw
class NotFoundException {
  constructor (message) {
    this.name = 'NotFoundException'
    this.message = message
  }
}

describe('Settings', () => {
  describe('vaildateURL', () => {
    it('should return true if the URL is valid', async () => {
      const settings = new Settings()
      const urls = ['https://example.com', 'http://example.com', 'example.com', 'https://example.com/test']
      urls.forEach(url => {
        assert(settings.validateURL(url))
      })
    })

    it('should return false if the URL is invalid', async () => {
      const settings = new Settings()
      const urls = ['https://', '', 'https://example']
      urls.forEach(url => {
        assert(!settings.validateURL(url))
      })
    })
  })

  describe('getServiceName', () => {
    afterEach(() => {
      SettingsStore.prototype.get.restore()
    })

    it('should return one component', async () => {
      const expected = 'value'
      sinon.stub(SettingsStore.prototype, 'get').returns(expected)

      const actual = await new Settings().getServiceName()
      assert(actual === expected)
    })

    it('should return empty string when matched no component', async () => {
      sinon.stub(SettingsStore.prototype, 'get').throws(new NotFoundError())
      const actual = await new Settings().getServiceName()
      assert(actual === '')
    })

    it('should throw error when error returned', async () => {
      sinon.stub(SettingsStore.prototype, 'get').throws(new Error())
      let error
      try {
        await new Settings().getServiceName()
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })

  describe('setServiceName', () => {
    afterEach(() => {
      SettingsStore.prototype.update.restore()
    })

    it('should update the service name and user pool', async () => {
      const expected = 'value'
      const updateStub = sinon.stub(SettingsStore.prototype, 'update')
      updateStub.returns(expected)
      const updateUserPoolStub = sinon.stub(Settings.prototype, 'updateUserPool')
      const snsStub = sinon.stub(SNS.prototype, 'notifyIncident')

      await new Settings().setServiceName(expected)
      assert(updateStub.called)
      assert(updateUserPoolStub.called)
      assert(snsStub.called)
      Settings.prototype.updateUserPool.restore()
      SNS.prototype.notifyIncident.restore()
    })

    it('should throw error when error returned', async () => {
      sinon.stub(SettingsStore.prototype, 'update').throws(new Error())
      let error
      try {
        await new Settings().setServiceName('')
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })

  describe('allApiKeys', () => {
    afterEach(() => {
      APIGateway.prototype.getApiKeys.restore()
    })

    it('should return the list of enabled api keys', async () => {
      const expected = [{id: '1', enabled: true}, {id: '2', enabled: false}]
      const stub = sinon.stub(APIGateway.prototype, 'getApiKeys').returns(expected)
      const keyPrefix = 'test'
      constants.stackName = keyPrefix

      const actual = await new Settings().allApiKeys()
      assert(actual.length === 1)
      assert(actual[0].id === expected[0].id)
      assert.deepEqual(stub.firstCall.args, [keyPrefix])
    })

    it('should throw the error if API returns the error ', async () => {
      sinon.stub(APIGateway.prototype, 'getApiKeys').throws(new Error())

      let err
      try {
        await new Settings().allApiKeys()
      } catch (e) {
        err = e
      }
      assert(err !== undefined)
    })
  })

  describe('lookupApiKey', () => {
    afterEach(() => {
      APIGateway.prototype.getApiKey.restore()
    })

    it('should return the specified api key', async () => {
      const id = '1'
      const stub = sinon.stub(APIGateway.prototype, 'getApiKey').returns({id})

      const actual = await new Settings().lookupApiKey(id)
      assert(actual.id === id)
      assert.deepEqual(stub.firstCall.args, [id])
    })

    it('should throw the error if API returns the error ', async () => {
      sinon.stub(APIGateway.prototype, 'getApiKey').throws(new Error())

      let err
      try {
        await new Settings().lookupApiKey()
      } catch (e) {
        err = e
      }
      assert(err !== undefined)
    })

    it('should throw the NotFound error if the api key is not found ', async () => {
      sinon.stub(APIGateway.prototype, 'getApiKey').throws(new NotFoundException())

      let err
      try {
        await new Settings().lookupApiKey()
      } catch (e) {
        err = e
      }
      assert(err.name === NotFoundError.name)
    })
  })

  describe('createApiKey', () => {
    afterEach(() => {
      APIGateway.prototype.createApiKey.restore()
      APIGateway.prototype.createUsagePlanKey.restore()
      CloudFormation.prototype.getUsagePlanID.restore()
    })

    it('should create the new api key', async () => {
      const expected = {id: '1'}
      const createApiKeyStub = sinon.stub(APIGateway.prototype, 'createApiKey').returns(expected)
      const createUsagePlanKeyStub = sinon.stub(APIGateway.prototype, 'createUsagePlanKey').returns()
      sinon.stub(CloudFormation.prototype, 'getUsagePlanID').returns()

      const actual = await new Settings().createApiKey()
      assert(actual.id === expected.id)
      assert(createApiKeyStub.calledOnce)
      assert(createUsagePlanKeyStub.calledOnce)
    })

    it('should throw the error if API returns the error ', async () => {
      constants.stackName = 'stack'
      sinon.stub(APIGateway.prototype, 'createApiKey').throws(new Error())
      sinon.stub(APIGateway.prototype, 'createUsagePlanKey').returns()
      sinon.stub(CloudFormation.prototype, 'getUsagePlanID').returns()

      try {
        await new Settings().createApiKey()
        assert(false)
      } catch (e) {
        assert(e !== undefined)
      }
    })
  })
})

describe('ApiKey', () => {
  describe('delete', () => {
    afterEach(() => {
      APIGateway.prototype.deleteApiKey.restore()
    })

    it('should delete the api key', async () => {
      const id = 'id'
      const stub = sinon.stub(APIGateway.prototype, 'deleteApiKey').returns()

      await new ApiKey(id).delete(id)
      assert.deepEqual(stub.firstCall.args, [id])
    })

    it('should throw the error if API returns the error ', async () => {
      sinon.stub(APIGateway.prototype, 'deleteApiKey').throws(new Error())

      let err
      try {
        await new ApiKey().delete()
      } catch (e) {
        err = e
      }
      assert(err !== undefined)
    })

    it('should throw the NotFound error if the key not found', async () => {
      sinon.stub(APIGateway.prototype, 'deleteApiKey').throws(new NotFoundException())

      let err
      try {
        await new ApiKey().delete()
      } catch (e) {
        err = e
      }
      assert(err.name === NotFoundError.name)
    })
  })
})
