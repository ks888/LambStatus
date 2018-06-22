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

  describe('sendEmailWithRetry', () => {
    it('should retry if failed', async () => {
      let numCalled = 0
      AWS.mock('SES', 'sendEmail', (params, callback) => {
        numCalled++
        callback(new Error('test'))
      })

      let err
      try {
        await new SES('us-west-2', 'test@example.com').sendEmailWithRetry('test@example.com', 'title', 'body')
      } catch (error) {
        err = error
      }
      assert(err !== undefined)
      assert(numCalled === 3)
    })
  })
})
