import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/confirmSubscription'
import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'

describe('confirmSubscription', () => {
  afterEach(() => {
    Cognito.prototype.confirm.restore()
    CloudFormation.prototype.getSubscribersPoolID.restore()
    Cognito.prototype.getUser.restore()
  })

  it('should call confirm func', async () => {
    const confirmStub = sinon.stub(Cognito.prototype, 'confirm').returns()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    const getUserStub = sinon.stub(Cognito.prototype, 'getUser')

    let err
    await handle({}, null, (error) => {
      err = error
    })

    assert(err === undefined)
    assert(confirmStub.calledOnce)
    assert(getUserStub.notCalled)
  })

  it('should check a user is already confirmed if confirm func fails', async () => {
    sinon.stub(Cognito.prototype, 'confirm').throws()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    const getUserStub = sinon.stub(Cognito.prototype, 'getUser').returns({UserStatus: 'CONFIRMED'})

    let err
    await handle({}, null, (error) => {
      err = error
    })

    assert(err === undefined)
    assert(getUserStub.calledOnce)
  })

  it('should return error if confirm func fails and a user is not confirmed', async () => {
    sinon.stub(Cognito.prototype, 'confirm').throws()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    sinon.stub(Cognito.prototype, 'getUser').returns({UserStatus: 'UNCONFIRMED'})

    let err
    await handle({}, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
