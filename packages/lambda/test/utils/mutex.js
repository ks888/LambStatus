import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import Mutex from 'utils/mutex'

describe('Mutex', () => {
  afterEach(() => {
    AWS.restore('DynamoDB.DocumentClient')
  })

  describe('lockWithRetry', () => {
    it('should retry the lock operation if it fails', async () => {
      let callCount = 0
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        if (callCount === 0) {
          callback({code: 'ConditionalCheckFailedException'})
        } else {
          callback(null, {})
        }
        callCount++
      })

      const key = {id: 1}
      await new Mutex({intervalBetweenRetry: 1}).lockWithRetry('table', key)
      assert(callCount === 2)
    })

    it('should continue to retry the operation until maxRetries reached', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback({code: 'ConditionalCheckFailedException'})
      })

      let actual
      try {
        const key = {id: 1}
        await new Mutex({intervalBetweenRetry: 1}).lockWithRetry('table', key)
      } catch (err) {
        actual = err
      }
      assert(actual.name === 'MutexLockedError')
    })

    it('should not retry the operation if not MutexError', async () => {
      let callCount = 0
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(new Error('test'))
        callCount++
      })

      let actual
      try {
        const key = {id: 1}
        await new Mutex({intervalBetweenRetry: 1}).lockWithRetry('table', key)
      } catch (err) {
        actual = err
      }
      assert(actual !== undefined)
      assert(callCount === 1)
    })
  })

  describe('lock', () => {
    it('should update the locked & expiryDate attribute', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        actual = params
        callback(null, {})
      })

      const key = {id: 1}
      await new Mutex().lock('table', key)
      assert(actual.Key.id === key.id)
      assert(actual.UpdateExpression === 'set locked = :t, expiryDate = :e')
      assert(actual.ConditionExpression === '(locked <> :t) or (expiryDate < :c)')
    })

    it('should specify appropriate expiry date', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        actual = params
        callback(null, {Attributes: {}})
      })
      const curr = new Date()
      const clock = sinon.useFakeTimers(curr.getTime())

      const key = {id: 1}
      const lifetime = 1000
      await new Mutex({lifetime}).lock('table', key)
      curr.setMilliseconds(curr.getMilliseconds() + lifetime)
      assert(actual.ExpressionAttributeValues[':e'] === curr.toISOString())

      clock.restore()
    })

    it('should throws Error if the mutex is locked', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback({code: 'ConditionalCheckFailedException'})
      })

      let actual
      try {
        await new Mutex().lock('table', {id: 1})
      } catch (err) {
        actual = err
      }
      assert(actual.name === 'MutexLockedError')
    })
  })

  describe('unlock', () => {
    it('should update the locked attribute', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        actual = params
        callback(null, {})
      })

      const key = {id: 1}
      await new Mutex().unlock('table', key)
      assert(actual.Key.id === key.id)
      assert(actual.UpdateExpression === 'set locked = :f')
    })
  })
})
