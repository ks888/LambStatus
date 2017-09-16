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
        Key: { key }
      }
      this.awsDynamoDb.get(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (data.Item === undefined) {
          return reject(new NotFoundError('no matched item'))
        }

        resolve(data.Item.value)
      })
    })
  }

  update (key, value) {
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
        if (data.Attributes === undefined) {
          // No item matching the given key
          resolve('')
          return
        }
        resolve(data.Attributes.value)
      })
    })
  }
}
