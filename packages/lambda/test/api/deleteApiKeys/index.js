import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/deleteApiKeys'
import { Settings, ApiKey } from 'model/settings'
import { NotFoundError } from 'utils/errors'

describe('deleteApiKeys', () => {
  afterEach(() => {
    ApiKey.prototype.delete.restore()
    Settings.prototype.lookupApiKey.restore()
  })

  it('should delete the api key', async () => {
    const deleteStub = sinon.stub(ApiKey.prototype, 'delete').returns()
    const lookupApiKeyStub = sinon.stub(Settings.prototype, 'lookupApiKey').returns(new ApiKey())

    const id = 'id'
    await handle({ params: {apikeyid: id} }, null, (error, result) => {
      assert(error === null)
    })
    assert(lookupApiKeyStub.firstCall.args, [id])
    assert(deleteStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ApiKey.prototype, 'delete').throws()
    sinon.stub(Settings.prototype, 'lookupApiKey').returns(new ApiKey())

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })

  it('should return the NotFound error if the key is not found', async () => {
    sinon.stub(ApiKey.prototype, 'delete').returns()
    sinon.stub(Settings.prototype, 'lookupApiKey').throws(new NotFoundError())

    return await handle({ params: {apikeyid: ''} }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })
})
