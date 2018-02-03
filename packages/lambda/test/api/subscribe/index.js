import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/subscribe'
import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'

describe('subscribe', () => {
  afterEach(() => {
    Cognito.prototype.signUp.restore()
    CloudFormation.prototype.getSubscribersPoolClientID.restore()
  })

  it('should call signUp func', async () => {
    const signUpStub = sinon.stub(Cognito.prototype, 'signUp').returns()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolClientID')

    const event = {emailAddress: 'test@example.com'}
    let actual
    let err
    await handle(event, null, (error, result) => {
      actual = result
      err = error
    })

    assert(err === null)
    assert(actual.username.length === 12)
    assert(signUpStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(Cognito.prototype, 'signUp').returns()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolClientID')

    const event = {}
    let err
    await handle(event, null, (error, result) => {
      err = error
    })
    assert(err.match(/invalid/))
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Cognito.prototype, 'signUp').throws()
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolClientID')

    const event = {emailAddress: 'test@example.com'}
    let err
    await handle(event, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
