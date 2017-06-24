import assert from 'assert'
import sinon from 'sinon'
import SNS from 'aws/sns'
import { Settings } from 'model/settings'
import SettingsStore from 'db/settings'
import APIGateway from 'aws/apiGateway'
import { NotFoundError } from 'utils/errors'
import * as constants from 'utils/const'

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

  describe('getApiKeys', () => {
    afterEach(() => {
      APIGateway.prototype.getApiKeys.restore()
    })

    it('should return the list of enabled api keys', async () => {
      const expected = [{id: '1', enabled: true}, {id: '2', enabled: false}]
      const stub = sinon.stub(APIGateway.prototype, 'getApiKeys').returns(expected)

      const keyPrefix = 'test'
      constants.stackName = keyPrefix
      const actual = await new Settings().getApiKeys()
      assert(actual.length === 1)
      assert(actual[0].id === expected[0].id)
      assert.deepEqual(stub.firstCall.args, [keyPrefix])
    })

    it('should throw the error if API returns the error ', async () => {
      sinon.stub(APIGateway.prototype, 'getApiKeys').throws(new Error())

      let err
      try {
        await new Settings().getApiKeys()
      } catch (e) {
        err = e
      }
      assert(err !== undefined)
    })
  })
})
