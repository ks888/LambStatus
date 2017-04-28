import AWS from 'aws-sdk'
import VError from 'verror'
import { NotFoundError } from 'utils/errors'
import { SettingsTable } from 'utils/const'
import { buildUpdateExpression } from './utils'

export default class SettingsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  get (key) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: SettingsTable,
        KeyConditionExpression: '#k = :hkey',
        ExpressionAttributeNames: {
          '#k': 'key',
          '#v': 'value'
        },
        ExpressionAttributeValues: {
          ':hkey': key
        },
        ProjectionExpression: '#v'
      }
      this.awsDynamoDb.query(params, (err, queryResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (queryResult.Items.length === 0) {
          return reject(new NotFoundError('no matched item'))
        } else if (queryResult.Items.length !== 1) {
          return reject(new Error('matched too many items'))
        }

        resolve(queryResult.Items[0][key])
      })
    })
  }

  set (key, value) {
    const [updateExp, attrNames, attrValues] = buildUpdateExpression({ value })
    return new Promise((resolve, reject) => {
      const params = {
        Key: { key },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: SettingsTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data.Attributes)
      })
    })
  }
}
