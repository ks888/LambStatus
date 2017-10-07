import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/deleteApiKeys'
import APIGateway from 'aws/apiGateway'
import { NotFoundError } from 'utils/errors'

describe('deleteApiKeys', () => {
  afterEach(() => {
    APIGateway.prototype.disableAndDeleteApiKey.restore()
  })

  it('should delete the api key', async () => {
    const deleteStub = sinon.stub(APIGateway.prototype, 'disableAndDeleteApiKey').returns()

    const id = 'id'
    await handle({ params: {apikeyid: id} }, null, (error, result) => {
      assert(error === null)
    })
    assert(deleteStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(APIGateway.prototype, 'disableAndDeleteApiKey').throws()

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })

  it('should return the NotFound error if the key is not found', async () => {
    sinon.stub(APIGateway.prototype, 'disableAndDeleteApiKey').throws(new NotFoundError())

    return await handle({ params: {apikeyid: ''} }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })
})
