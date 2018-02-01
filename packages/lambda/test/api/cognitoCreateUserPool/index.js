import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/cognitoCreateUserPool'
import response from 'cfn-response'
import { AdminUserPool } from 'aws/cognito'
import { SettingsProxy } from 'api/utils'

describe('cognitoCreateUserPool', () => {
  describe('Create request type', () => {
    afterEach(() => {
      SettingsProxy.prototype.getServiceName.restore()
      AdminUserPool.prototype.create.restore()
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
      const id = 'id'
      sinon.stub(SettingsProxy.prototype, 'getServiceName').returns('serviceName')
      const createStub = sinon.stub(AdminUserPool.prototype, 'create').returns('id')
      const sendStub = sinon.stub(response, 'send').returns()

      await handle(event, null, null)

      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[2] === response.SUCCESS)
      assert(sendStub.firstCall.args[4] === id)
      assert(createStub.calledOnce)
    })
  })

  describe('Update request type', () => {
    afterEach(() => {
      SettingsProxy.prototype.getServiceName.restore()
      AdminUserPool.get.restore()
      AdminUserPool.prototype.update.restore()
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
      sinon.stub(AdminUserPool, 'get', (poolID, params) => {
        assert(poolID === event.PhysicalResourceId)
        assert(serviceName === params.serviceName)
        return new AdminUserPool({})
      })
      const updateStub = sinon.stub(AdminUserPool.prototype, 'update')
      const sendStub = sinon.stub(response, 'send').returns()

      await handle(event, null, null)

      assert(updateStub.calledOnce)

      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[2] === response.SUCCESS)
      assert(sendStub.firstCall.args[4] === event.PhysicalResourceId)
    })
  })

  describe('Delete request type', () => {
    afterEach(() => {
      AdminUserPool.get.restore()
      AdminUserPool.prototype.delete.restore()
      response.send.restore()
    })

    it('should delete the user pool', async () => {
      const event = {
        RequestType: 'Delete',
        PhysicalResourceId: 'id',
        ResourceProperties: {}
      }
      sinon.stub(AdminUserPool, 'get', (poolID, params) => {
        assert(poolID === event.PhysicalResourceId)
        return new AdminUserPool({})
      })
      const deleteStub = sinon.stub(AdminUserPool.prototype, 'delete')
      const sendStub = sinon.stub(response, 'send').returns()

      await handle(event, null, null)

      assert(deleteStub.calledOnce)

      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[2] === response.SUCCESS)
      assert(sendStub.firstCall.args[4] === event.PhysicalResourceId)
    })
  })
})
