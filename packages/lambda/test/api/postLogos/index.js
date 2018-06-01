import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postLogos'
import { SettingsProxy } from 'api/utils'
import S3 from 'aws/s3'
import CloudFormation from 'aws/cloudFormation'

describe('postLogos', () => {
  let putObjectStub
  let getStatusPageBucketNameStub
  let setLogoIDStub
  const bucketName = 'test'

  beforeEach(() => {
    setLogoIDStub = sinon.stub(SettingsProxy.prototype, 'setLogoID').returns()
    putObjectStub = sinon.stub(S3.prototype, 'putObject').returns()
    getStatusPageBucketNameStub = sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns(bucketName)
  })

  afterEach(() => {
    SettingsProxy.prototype.setLogoID.restore()
    S3.prototype.putObject.restore()
    CloudFormation.prototype.getStatusPageBucketName.restore()
  })

  const generateEvent = () => {
    // eslint-disable-next-line
    return {data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX/TQBcNTh/AAAAAXRSTlPM0jRW/QAAAApJREFUeJxjYgAAAAYAAzY3fKgAAAAASUVORK5CYII='}
  }

  it('should store images into s3 bucket', async () => {
    const event = generateEvent()
    await handle(event, null, (error, result) => {
      assert(error === null)
    })

    assert(getStatusPageBucketNameStub.calledOnce)
    assert(putObjectStub.calledTwice)
    assert(putObjectStub.firstCall.args[1] === bucketName)
    assert(putObjectStub.firstCall.args[2].endsWith('@2x'))
    assert(putObjectStub.firstCall.args[4] === 'image/png')
    assert(putObjectStub.firstCall.args[6] === 'public-read')
  })

  it('should save logo ID in the DB', async () => {
    const event = generateEvent()
    await handle(event, null, (error, result) => {
      assert(error === null)
      assert(result.id !== undefined)
    })

    assert(setLogoIDStub.calledOnce)
    assert(setLogoIDStub.firstCall.args[0].length > 0)
  })

  it('should return error if invalid data', async () => {
    const event = {data: 'data:text/plain'}
    await handle(event, null, (error, result) => {
      assert(error !== null)
    })
  })
})
