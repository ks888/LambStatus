import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/cognitoCreateUserPool'
import response from 'cfn-response'
import Cognito from 'aws/cognito'
import { SettingsProxy } from 'api/utils'

describe('cognitoCreateUserPool', () => {
  describe('Create request type', () => {
    afterEach(() => {
      SettingsProxy.prototype.getServiceName.restore()
      Cognito.prototype.createUserPool.restore()
      response.send.restore()
    })

    it('should create a new user pool', async () => {
      const event = {
        RequestType: 'Create',
        ResourceProperties: {
          PoolName: 'poolName',
          AdminPageURL: 'example.com',
          SnsCallerArn: 'arn:...'
        }
      }
      sinon.stub(SettingsProxy.prototype, 'getServiceName').returns('serviceName')
      const createStub = sinon.stub(Cognito.prototype, 'createUserPool').returns({userPoolID: 'id'})
      const sendStub = sinon.stub(response, 'send').returns()

      await handle(event, null, null)
      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[2] === response.SUCCESS)
      assert(createStub.calledOnce)
      assert(createStub.firstCall.args[0].userPoolName === event.ResourceProperties.PoolName)
    })
  })

  describe('Update request type', () => {
    afterEach(() => {
      SettingsProxy.prototype.getServiceName.restore()
      Cognito.prototype.getUserPool.restore()
      Cognito.prototype.updateUserPool.restore()
      response.send.restore()
    })

    it('should update the existing user pool', async () => {
      const event = {
        RequestType: 'Update',
        PhysicalResourceId: 'id',
        ResourceProperties: {
          AdminPageURL: 'example.com'
        }
      }
      const serviceName = 'serviceName'
      sinon.stub(SettingsProxy.prototype, 'getServiceName').returns(serviceName)
      sinon.stub(Cognito.prototype, 'getUserPool').returns({})
      const updateStub = sinon.stub(Cognito.prototype, 'updateUserPool').returns()
      const sendStub = sinon.stub(response, 'send').returns()

      await handle(event, null, null)
      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[2] === response.SUCCESS)
      assert(updateStub.calledOnce)
      assert(updateStub.firstCall.args[0].adminPageURL === event.ResourceProperties.AdminPageURL)
      assert(updateStub.firstCall.args[0].serviceName === serviceName)
    })
  })

  describe('Delete request type', () => {
    afterEach(() => {
      Cognito.prototype.deleteUserPool.restore()
      response.send.restore()
    })

    it('should delete the user pool', async () => {
      const event = {
        RequestType: 'Delete',
        PhysicalResourceId: 'id',
        ResourceProperties: {}
      }
      const deleteStub = sinon.stub(Cognito.prototype, 'deleteUserPool').returns()
      const sendStub = sinon.stub(response, 'send').returns()

      await handle(event, null, null)
      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[2] === response.SUCCESS)
      assert(deleteStub.calledOnce)
      assert(deleteStub.firstCall.args[0] === event.PhysicalResourceId)
    })
  })
})
