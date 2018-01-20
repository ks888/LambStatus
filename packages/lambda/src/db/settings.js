import AWS from 'aws-sdk'
import VError from 'verror'
import { NotFoundError } from 'utils/errors'
import { SettingsTable } from 'utils/const'
import { buildUpdateExpression } from './utils'

// InvocationURL, UserPoolID, and ClientID are parts of S3 object (settings.js). Do not store them here.

export const settingKeys = {
  serviceName: 'ServiceName',
  cognitoPoolID: 'CognitoPoolID',
  logoID: 'logoID'
}

export default class SettingsStore {
  constructor () {
    this.store = new RawSettingsStore()
  }

  async getServiceName () {
    return await this.store.get(settingKeys.serviceName)
  }

  async setServiceName (name) {
    return await this.store.set(settingKeys.serviceName, name)
  }

  async getCognitoPoolID () {
    return await this.store.get(settingKeys.cognitoPoolID)
  }

  async setCognitoPoolID (id) {
    return await this.store.set(settingKeys.cognitoPoolID, id)
  }

  async getLogoID () {
    return await this.store.get(settingKeys.logoID)
  }

  async setLogoID (id) {
    return await this.store.set(settingKeys.logoID, id)
  }

  async deleteLogoID () {
    return await this.store.delete(settingKeys.logoID)
  }
}

export class RawSettingsStore {
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
        resolve(data.Attributes.value)
      })
    })
  }

  delete (key) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { key },
        TableName: SettingsTable,
        ReturnValues: 'NONE'
      }
      this.awsDynamoDb.delete(params, (err) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve()
      })
    })
  }
}
