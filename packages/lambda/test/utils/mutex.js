import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import { lock } from 'utils/mutex'

describe('mutex', () => {
  describe('lock', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the locked & expiryDate attribute', async () => {
      let actual
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        actual = params
        callback(null, {Attributes: {}})
      })

      const key = {id: 1}
      await lock('table', key)
      assert(actual.Key.id === key.id)
      assert(actual.UpdateExpression === 'set locked = :t, expiryDate = :e + :l')
      assert(actual.ConditionExpression === '(locked <> :t) or (expiryDate < :e)')
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
      await lock('table', key, lifetime)
      assert(actual.ExpressionAttributeValues[':e'] === curr.getTime())

      clock.restore()
    })

    it('should throws Error if the mutex is locked', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback({code: 'ConditionalCheckFailedException'})
      })

      let actual
      try {
        await lock('table', {id: 1})
      } catch (err) {
        actual = err
      }
      assert(actual.name === 'MutexLockedError')
    })
  })
})
