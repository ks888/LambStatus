import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postApiKeys'
import { Settings, ApiKey } from 'model/settings'

describe('postApiKeys', () => {
  afterEach(() => {
    Settings.prototype.createApiKey.restore()
  })

  it('should create the api key', async () => {
    const apiKey = new ApiKey('1', 'a', '', '')
    sinon.stub(Settings.prototype, 'createApiKey').returns(apiKey)

    await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result.id === apiKey.id)
      assert(result.value === apiKey.value)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Settings.prototype, 'createApiKey').throws()

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
