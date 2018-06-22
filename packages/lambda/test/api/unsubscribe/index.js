import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/unsubscribe'
import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'

describe('unsubscribe', () => {
  let deleteUserStub

  beforeEach(() => {
    deleteUserStub = sinon.stub(Cognito.prototype, 'deleteUser').returns()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    sinon.stub(CloudFormation.prototype, 'getStatusPageCloudFrontURL')
  })

  afterEach(() => {
    Cognito.prototype.getUser.restore()
    Cognito.prototype.deleteUser.restore()
    CloudFormation.prototype.getSubscribersPoolID.restore()
    CloudFormation.prototype.getStatusPageCloudFrontURL.restore()
  })

  it('should delete the user if the token is valid', async () => {
    const token = 'token'
    sinon.stub(Cognito.prototype, 'getUser').returns({UserAttributes: [{Name: 'custom:token', Value: token}]})

    const event = {token}
    let actual
    let err
    await handle(event, null, (error, data) => {
      actual = data
      err = error
    })

    assert(err === null)
    assert(actual.message !== undefined)
    assert(actual.script !== undefined)
    assert(deleteUserStub.calledOnce)
  })

  it('should return error if a token is invalid', async () => {
    sinon.stub(Cognito.prototype, 'getUser').returns({UserAttributes: [{Name: 'custom:token', Value: 'token'}]})

    const event = {}
    let err
    await handle(event, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
    assert(deleteUserStub.notCalled)
  })

  it('should do nothing if a user not found', async () => {
    const token = 'token'
    const notFoundErr = new Error()
    notFoundErr.name = 'UserNotFoundException'
    sinon.stub(Cognito.prototype, 'getUser').throws(notFoundErr)

    const event = {token}
    let actual
    let err
    await handle(event, null, (error, data) => {
      actual = data
      err = error
    })

    assert(err === null)
    assert(actual.message !== undefined)
    assert(actual.script !== undefined)
  })
})
