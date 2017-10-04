import assert from 'assert'
import sinon from 'sinon'
import { updateComponentStatus, SettingsProxy } from 'api/utils'
import Cognito, { UserPool } from 'aws/cognito'
import ComponentsStore from 'db/components'

describe('updateComponentStatus', () => {
  it('should call updateStatus', () => {
    const updateStatusStub = sinon.stub(ComponentsStore.prototype, 'updateStatus').returns()

    updateComponentStatus({componentID: '1', status: 'test'})
    assert(updateStatusStub.calledOnce)

    ComponentsStore.prototype.updateStatus.restore()
  })
})

describe('SettingsProxy', () => {
  describe('setServiceName', () => {
    it('should update the service name and user pool and publish notification', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setServiceName = sinon.spy()
      proxy.updateUserPool = sinon.spy()
      proxy.sns.notifyIncident = sinon.spy()

      const serviceName = 'test'
      await proxy.setServiceName(serviceName)

      assert(proxy.settings.serviceName === serviceName)
      assert(proxy.store.setServiceName.calledOnce)
      assert(proxy.store.setServiceName.firstCall.args[0] === serviceName)
      assert(proxy.updateUserPool.calledOnce)
      assert(proxy.sns.notifyIncident.calledOnce)
    })
  })

  describe('getServiceName', () => {
    it('should get the service name from store if not cached', async () => {
      const serviceName = 'test'
      const proxy = new SettingsProxy()
      proxy.store.getServiceName = async () => serviceName

      const actual = await proxy.getServiceName()
      assert(serviceName === actual)
      assert(serviceName === proxy.settings.serviceName)
    })

    it('should get the service name from cache if available', async () => {
      const serviceName = 'test'
      const proxy = new SettingsProxy()
      proxy.settings.setServiceName(serviceName)
      proxy.store.getServiceName = sinon.spy()

      const actual = await proxy.getServiceName()
      assert(serviceName === actual)
      assert(proxy.store.getServiceName.notCalled)
    })
  })

  describe('setAdminPageURL', () => {
    it('should update the AdminPage URL and user pool and publish notification', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setAdminPageURL = sinon.spy()
      proxy.updateUserPool = sinon.spy()
      proxy.sns.notifyIncident = sinon.spy()

      const adminPageURL = 'https://example.com'
      await proxy.setAdminPageURL(adminPageURL)

      assert(proxy.settings.adminPageURL === adminPageURL)
      assert(proxy.store.setAdminPageURL.calledOnce)
      assert(proxy.store.setAdminPageURL.firstCall.args[0] === adminPageURL)
      assert(proxy.updateUserPool.calledOnce)
      assert(proxy.sns.notifyIncident.notCalled)
    })
  })

  describe('getAdminPageURL', () => {
    it('should get the AdminPage URL from store if not cached', async () => {
      const adminPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.store.getAdminPageURL = async () => adminPageURL

      const actual = await proxy.getAdminPageURL()
      assert(adminPageURL === actual)
      assert(adminPageURL === proxy.settings.adminPageURL)
    })

    it('should get the AdminPage URL from cache if available', async () => {
      const adminPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.settings.setAdminPageURL(adminPageURL)
      proxy.store.getAdminPageURL = sinon.spy()

      const actual = await proxy.getAdminPageURL()
      assert(adminPageURL === actual)
      assert(proxy.store.getAdminPageURL.notCalled)
    })
  })

  describe('setStatusPageURL', () => {
    it('should update the StatusPage URL and user pool and publish notification', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setStatusPageURL = sinon.spy()
      proxy.updateUserPool = sinon.spy()
      proxy.sns.notifyIncident = sinon.spy()

      const statusPageURL = 'https://example.com'
      await proxy.setStatusPageURL(statusPageURL)

      assert(proxy.settings.statusPageURL === statusPageURL)
      assert(proxy.store.setStatusPageURL.calledOnce)
      assert(proxy.store.setStatusPageURL.firstCall.args[0] === statusPageURL)
      assert(proxy.updateUserPool.notCalled)
      assert(proxy.sns.notifyIncident.calledOnce)
    })
  })

  describe('getStatusPageURL', () => {
    it('should get the StatusPage URL from store if not cached', async () => {
      const statusPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.store.getStatusPageURL = async () => statusPageURL

      const actual = await proxy.getStatusPageURL()
      assert(statusPageURL === actual)
      assert(statusPageURL === proxy.settings.statusPageURL)
    })

    it('should get the StatusPage URL from cache if available', async () => {
      const statusPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.settings.setStatusPageURL(statusPageURL)
      proxy.store.getStatusPageURL = sinon.spy()

      const actual = await proxy.getStatusPageURL()
      assert(statusPageURL === actual)
      assert(proxy.store.getStatusPageURL.notCalled)
    })
  })

  describe('setCognitoPoolID', () => {
    it('should update the CognitoPoolID and user pool and publish notification', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setCognitoPoolID = sinon.spy()
      proxy.updateUserPool = sinon.spy()
      proxy.sns.notifyIncident = sinon.spy()

      const cognitoPoolID = 'id'
      await proxy.setCognitoPoolID(cognitoPoolID)

      assert(proxy.settings.cognitoPoolID === cognitoPoolID)
      assert(proxy.store.setCognitoPoolID.calledOnce)
      assert(proxy.store.setCognitoPoolID.firstCall.args[0] === cognitoPoolID)
      assert(proxy.updateUserPool.notCalled)
      assert(proxy.sns.notifyIncident.notCalled)
    })
  })

  describe('getCognitoPoolID', () => {
    it('should get the CognitoPoolID from store if not cached', async () => {
      const cognitoPoolID = 'id'
      const proxy = new SettingsProxy()
      proxy.store.getCognitoPoolID = async () => cognitoPoolID

      const actual = await proxy.getCognitoPoolID()
      assert(cognitoPoolID === actual)
      assert(cognitoPoolID === proxy.settings.cognitoPoolID)
    })

    it('should get the CognitoPoolID from cache if available', async () => {
      const cognitoPoolID = 'id'
      const proxy = new SettingsProxy()
      proxy.settings.setCognitoPoolID(cognitoPoolID)
      proxy.store.getCognitoPoolID = sinon.spy()

      const actual = await proxy.getCognitoPoolID()
      assert(cognitoPoolID === actual)
      assert(proxy.store.getCognitoPoolID.notCalled)
    })
  })

  describe('updateUserPool', () => {
    it('should update the user pool with valid params', async () => {
      sinon.stub(Cognito.prototype, 'getUserPool').returns(new UserPool({userPoolID: '', snsCallerArn: ''}))
      const updatePoolStub = sinon.stub(Cognito.prototype, 'updateUserPool').returns()

      const serviceName = 'test'
      const adminPageURL = 'admin'
      const cognitoPoolID = 'id'
      const proxy = new SettingsProxy({serviceName, adminPageURL, cognitoPoolID})
      await proxy.updateUserPool()

      assert(updatePoolStub.calledOnce)
      assert(updatePoolStub.firstCall.args[0] === cognitoPoolID)
      assert(updatePoolStub.firstCall.args[1] === serviceName)
      assert(updatePoolStub.firstCall.args[2] === adminPageURL)
      assert(updatePoolStub.firstCall.args[3] === '')

      Cognito.prototype.getUserPool.restore()
    })
  })
})
