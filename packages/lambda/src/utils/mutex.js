import AWS from 'aws-sdk'
import VError from 'verror'
import { MutexLockedError } from 'utils/errors'

const defaultLifetimeInMilliseconds = 60000 // 60s

export const lock = (tableName, key, lifetimeInMilliseconds = defaultLifetimeInMilliseconds) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: key,
      UpdateExpression: `set locked = :t, expiryDate = :e + :l`,
      ConditionExpression: '(locked <> :t) or (expiryDate < :e)',
      ExpressionAttributeValues: {
        ':t': true,
        ':e': new Date().getTime(),
        ':l': lifetimeInMilliseconds
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
