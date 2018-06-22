import assert from 'assert'
import AWS from 'aws-sdk-mock'
import SNS, { messageType } from 'aws/sns'

describe('SNS', () => {
  afterEach(() => {
    AWS.restore('SNS')
  })

  describe('constructor', () => {
    it('should use the specified region', async () => {
      const expect = 'test-region-1'
      const sns = new SNS(expect)
      assert(sns.sns.endpoint.host.includes(expect))
    })
  })

  describe('publish', () => {
    it('should call publish func', async () => {
      let actual
      AWS.mock('SNS', 'publish', (params, callback) => {
        actual = params
        callback(null)
      })

      const topicARN = 'arn:aws:sns:us-west-2:account:IncidentNotification'
      const message = 'test'
      const type = messageType.incidentCreated
      await new SNS().publish(topicARN, message, type)
      assert(actual.TopicArn === topicARN)
      assert(actual.Message.includes(message))
      assert(actual.Message.includes(type))
    })
  })

  describe('listTopics', () => {
    it('should call listTopics func', async () => {
      let numCalled = 0
      AWS.mock('SNS', 'listTopics', (params, callback) => {
        numCalled++
        callback(null, {Topics: ['arn:aws:sns:us-west-2:account:IncidentNotification']})
      })

      await new SNS().listTopics()
      assert(numCalled === 1)
    })

    it('should do the pagination', async () => {
      let numCalled = 0
      AWS.mock('SNS', 'listTopics', (params, callback) => {
        numCalled++
        if (numCalled === 1) {
          callback(null, {Topics: ['arn:aws:sns:us-west-2:account:IncidentNotification'], NextToken: 'next'})
        } else {
          callback(null, {Topics: ['arn:aws:sns:us-west-2:account:IncidentNotification']})
        }
      })

      const actual = await new SNS().listTopics()
      assert(numCalled === 2)
      assert(actual.length === 2)
    })
  })

  describe('createTopic', () => {
    it('should call createTopic func', async () => {
      let numCalled = 0
      AWS.mock('SNS', 'createTopic', (params, callback) => {
        numCalled++
        callback(null, {})
      })

      await new SNS().createTopic('test')
      assert(numCalled === 1)
    })
  })

  describe('subscribeWithLambda', () => {
    it('should call subscribe with proper params', async () => {
      let actual
      AWS.mock('SNS', 'subscribe', (params, callback) => {
        actual = params
        callback(null, {})
      })

      const topic = 'test'
      const lambdaARN = 'arn:'
      await new SNS().subscribeWithLambda(topic, lambdaARN)
      assert(actual.TopicArn === topic)
      assert(actual.Protocol === 'lambda')
      assert(actual.Endpoint === lambdaARN)
    })
  })
})
