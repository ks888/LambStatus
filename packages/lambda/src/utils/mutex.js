import AWS from 'aws-sdk'
import VError from 'verror'
import { MutexLockedError } from 'utils/errors'

const defaultLifetimeInMilliseconds = 60000 // 60s

export const lock = (tableName, key, lifetimeInMilliseconds = defaultLifetimeInMilliseconds) => {
  const curr = new Date()
  const expiryDate = new Date(curr.getTime())
  expiryDate.setMilliseconds(expiryDate.getMilliseconds() + lifetimeInMilliseconds)
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

export const unlock = (tableName, key) => {
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
