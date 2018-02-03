import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/confirmSubscription'
import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { SettingsProxy } from 'api/utils'

describe('confirmSubscription', () => {
  beforeEach(() => {
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolClientID')
    sinon.stub(SettingsProxy.prototype, 'getStatusPageURL')
  })

  afterEach(() => {
    Cognito.prototype.confirm.restore()
    CloudFormation.prototype.getSubscribersPoolID.restore()
    CloudFormation.prototype.getSubscribersPoolClientID.restore()
    SettingsProxy.prototype.getStatusPageURL.restore()
    Cognito.prototype.getUser.restore()
  })

  it('should call confirm func', async () => {
    const confirmStub = sinon.stub(Cognito.prototype, 'confirm').returns()
    const getUserStub = sinon.stub(Cognito.prototype, 'getUser')

    let actual
    let err
    await handle({}, null, (error, data) => {
      actual = data
      err = error
    })

    assert(err === null)
    assert(actual.message !== undefined)
    assert(actual.script !== undefined)
    assert(confirmStub.calledOnce)
    assert(getUserStub.notCalled)
  })

  it('should return no error if the email is already registered', async () => {
    let alreadyExistsError = new Error()
    alreadyExistsError.name = 'AliasExistsException'
    sinon.stub(Cognito.prototype, 'confirm').throws(alreadyExistsError)
    sinon.stub(Cognito.prototype, 'getUser')

    let actual
    let err
    await handle({}, null, (error, data) => {
      actual = data
      err = error
    })

    assert(err === null)
    assert(actual.message !== undefined)
    assert(actual.script !== undefined)
  })

  it('should check a user is already confirmed if confirm func fails', async () => {
    sinon.stub(Cognito.prototype, 'confirm').throws()
    const getUserStub = sinon.stub(Cognito.prototype, 'getUser').returns({UserStatus: 'CONFIRMED'})

    let err
    await handle({}, null, (error) => {
      err = error
    })

    assert(err === null)
    assert(getUserStub.calledOnce)
  })

  it('should return error if confirm func fails and a user is not confirmed', async () => {
    sinon.stub(Cognito.prototype, 'confirm').throws()
    sinon.stub(Cognito.prototype, 'getUser').returns({UserStatus: 'UNCONFIRMED'})

    let err
    await handle({}, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
