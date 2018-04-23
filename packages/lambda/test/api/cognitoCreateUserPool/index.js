import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/cognitoCreateUserPool'
import { AdminUserPool } from 'aws/cognito'
import Response from 'aws/cfnResponse'
import { SettingsProxy } from 'api/utils'

describe('cognitoCreateUserPool', () => {
  let sendStub
  beforeEach(() => {
    sendStub = sinon.stub(Response, 'sendSuccess')
  })

  afterEach(() => {
    Response.sendSuccess.restore()
  })

  describe('Create request type', () => {
    afterEach(() => {
      SettingsProxy.prototype.getServiceName.restore()
      AdminUserPool.prototype.create.restore()
    })

    it('should create a new user pool', async () => {
      const event = {
        RequestType: 'Create',
        ResourceProperties: {
          PoolName: 'poolName',
          AdminPageURL: 'example.com',
          SnsCallerArn: 'arn:...'
        },
        ResponseURL: 'example.com'
      }
      const id = 'id'
      sinon.stub(SettingsProxy.prototype, 'getServiceName').returns('serviceName')
      const createStub = sinon.stub(AdminUserPool.prototype, 'create').returns('id')

      await handle(event, {done: () => {}}, null)

      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[3] === id)
      assert(createStub.calledOnce)
    })
  })

  describe('Update request type', () => {
    afterEach(() => {
      SettingsProxy.prototype.getServiceName.restore()
      AdminUserPool.get.restore()
      AdminUserPool.prototype.update.restore()
    })

    it('should update the existing user pool', async () => {
      const event = {
        RequestType: 'Update',
        PhysicalResourceId: 'id',
        ResourceProperties: {
          AdminPageURL: 'example.com'
        },
        ResponseURL: 'example.com'
      }
      const serviceName = 'serviceName'
      sinon.stub(SettingsProxy.prototype, 'getServiceName').returns(serviceName)
      sinon.stub(AdminUserPool, 'get', (poolID, params) => {
        assert(poolID === event.PhysicalResourceId)
        assert(serviceName === params.serviceName)
        return new AdminUserPool({})
      })
      const updateStub = sinon.stub(AdminUserPool.prototype, 'update')

      await handle(event, {done: () => {}}, null)

      assert(updateStub.calledOnce)

      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[3] === event.PhysicalResourceId)
    })
  })

  describe('Delete request type', () => {
    afterEach(() => {
      AdminUserPool.get.restore()
      AdminUserPool.prototype.delete.restore()
    })

    it('should delete the user pool', async () => {
      const event = {
        RequestType: 'Delete',
        PhysicalResourceId: 'id',
        ResourceProperties: {},
        ResponseURL: 'example.com'
      }
      sinon.stub(AdminUserPool, 'get', (poolID, params) => {
        assert(poolID === event.PhysicalResourceId)
        return new AdminUserPool({})
      })
      const deleteStub = sinon.stub(AdminUserPool.prototype, 'delete')

      await handle(event, {done: () => {}}, null)

      assert(deleteStub.calledOnce)

      assert(sendStub.calledOnce)
      assert(sendStub.firstCall.args[3] === event.PhysicalResourceId)
    })
  })
})
