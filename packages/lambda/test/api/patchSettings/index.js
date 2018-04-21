import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchSettings'
import { SettingsProxy } from 'api/utils'
import { NotFoundError, ValidationError } from 'utils/errors'

describe('patchMetrics', () => {
  let setServiceNameStub, setBackgroundColorStub, setEmailNotificationStub

  beforeEach(() => {
    setServiceNameStub = sinon.stub(SettingsProxy.prototype, 'setServiceName')
    setBackgroundColorStub = sinon.stub(SettingsProxy.prototype, 'setBackgroundColor')
    setEmailNotificationStub = sinon.stub(SettingsProxy.prototype, 'setEmailNotification')
  })

  afterEach(() => {
    SettingsProxy.prototype.setServiceName.restore()
    SettingsProxy.prototype.setBackgroundColor.restore()
    SettingsProxy.prototype.setEmailNotification.restore()
  })

  it('should set only the service name', async () => {
    const serviceName = 'test'
    await handle({ body: { serviceName } }, null, (error, actual) => {
      assert(error === null)
      assert(actual.serviceName === serviceName)
    })
    assert(setServiceNameStub.calledOnce)
    assert(setBackgroundColorStub.notCalled)
    assert(setEmailNotificationStub.notCalled)
  })

  it('should set only the background color', async () => {
    const backgroundColor = '#000000'
    await handle({ body: { backgroundColor } }, null, (error, actual) => {
      assert(error === null)
      assert(actual.backgroundColor === backgroundColor)
    })
    assert(setServiceNameStub.notCalled)
    assert(setBackgroundColorStub.calledOnce)
    assert(setEmailNotificationStub.notCalled)
  })

  it('should set only the email notification', async () => {
    const emailNotification = {enable: true}
    await handle({ body: { emailNotification } }, null, (error, actual) => {
      assert(error === null)
      assert(actual.emailNotification === emailNotification)
    })
    assert(setServiceNameStub.notCalled)
    assert(setBackgroundColorStub.notCalled)
    assert(setEmailNotificationStub.calledOnce)
  })

  it('should handle not found error', async () => {
    setServiceNameStub.throws(new NotFoundError())
    return await handle({ body: { serviceName: 'test' } }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should handle validation error', async () => {
    setServiceNameStub.throws(new ValidationError('invalid'))
    return await handle({ body: { serviceName: 'test' } }, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    setServiceNameStub.throws()

    return await handle({ body: { serviceName: 'test' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
