import AWS from 'aws-sdk'
import VError from 'verror'
import { MutexLockedError } from 'utils/errors'

const defaultMaxRetries = 5
const defaultIntervalBetweenRetry = 1000 // 1s
const defaultLifetime = 60000 // 60s

const sleep = async (durationInMilliseconds) => {
  return new Promise(resolve => setTimeout(resolve, durationInMilliseconds))
}

export default class Mutex {
  constructor ({maxRetries = defaultMaxRetries,
                intervalBetweenRetry = defaultIntervalBetweenRetry,
                lifetime = defaultLifetime} = {}) {
    this.maxRetries = maxRetries
    this.intervalBetweenRetry = intervalBetweenRetry
    this.lifetime = lifetime
  }

  async lockWithRetry (tableName, key) {
    let lastError
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        await this.lock(tableName, key)
        return
      } catch (err) {
        if (err.name !== MutexLockedError.name) throw err
        lastError = err
      }
      await sleep(this.intervalBetweenRetry)
    }
    throw lastError
  }

  lock (tableName, key) {
    const curr = new Date()
    const expiryDate = new Date(curr.getTime())
    expiryDate.setMilliseconds(expiryDate.getMilliseconds() + this.lifetime)

    return new Promise((resolve, reject) => {
      const params = {
        Key: key,
        UpdateExpression: `set locked = :t, expiryDate = :e`,
        ConditionExpression: '(locked <> :t) or (expiryDate < :c)',
        ExpressionAttributeValues: {
          ':t': true,
          ':c': curr.toISOString(),
          ':e': expiryDate.toISOString()
        },
        TableName: tableName
      }

      const { AWS_REGION: region } = process.env
      const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
      awsDynamoDb.update(params, (err, data) => {
        if (err && err.code === 'ConditionalCheckFailedException') {
          return reject(new MutexLockedError('mutex locked'))
        } else if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve()
      })
    })
  }

  unlock (tableName, key) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: key,
        UpdateExpression: `set locked = :f`,
        ExpressionAttributeValues: {
          ':f': false
        },
        TableName: tableName
      }

      const { AWS_REGION: region } = process.env
      const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
      awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve()
      })
    })
  }
}
