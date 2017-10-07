import assert from 'assert'
import sinon from 'sinon'
import APIGateway, { APIKey } from 'aws/apiGateway'
import CloudFormation from 'aws/cloudFormation'
import { handle } from 'api/postApiKeys'

describe('postApiKeys', () => {
  afterEach(() => {
    APIGateway.prototype.createApiKeyWithUsagePlan.restore()
    CloudFormation.prototype.getUsagePlanID.restore()
  })

  it('should create the api key', async () => {
    const apiKey = new APIKey({id: '1', value: 'a'})
    sinon.stub(APIGateway.prototype, 'createApiKeyWithUsagePlan').returns(apiKey)
    sinon.stub(CloudFormation.prototype, 'getUsagePlanID').returns('')

    await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result.id === apiKey.id)
      assert(result.value === apiKey.value)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(APIGateway.prototype, 'createApiKeyWithUsagePlan').throws()
    sinon.stub(CloudFormation.prototype, 'getUsagePlanID').returns('')

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
