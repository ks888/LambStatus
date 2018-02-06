import assert from 'assert'
import AWS from 'aws-sdk-mock'
import SES from 'aws/ses'

describe('SES', () => {
  afterEach(() => {
    AWS.restore('SES')
  })

  describe('sendEmail', () => {
    it('should send to only 1 address', async () => {
      let actual
      AWS.mock('SES', 'sendEmail', (params, callback) => {
        actual = params
        callback(null)
      })

      await new SES('us-west-2', 'test@example.com').sendEmail('test@example.com', 'title', 'body')
      assert(actual.Destination.ToAddresses.length === 1)
      assert(actual.Destination.BccAddresses === undefined)
      assert(actual.Destination.CcAddresses === undefined)
    })
  })
})
