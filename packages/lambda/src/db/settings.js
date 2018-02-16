import AWS from 'aws-sdk'
import VError from 'verror'
import { NotFoundError } from 'utils/errors'
import { SettingsTable } from 'utils/const'
import { buildUpdateExpression } from './utils'

// InvocationURL, UserPoolID, and ClientID are parts of S3 object (settings.js). Do not store them here.

export const settingKeys = {
  serviceName: 'ServiceName',
  logoID: 'LogoID',
  backgroundColor: 'BackgroundColor',
  enableEmailNotification: 'EnableEmailNotification',
  sourceEmailRegion: 'SourceEmailRegion',
  sourceEmailAddress: 'SourceEmailAddress'
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

  async getLogoID () {
    return await this.store.get(settingKeys.logoID)
  }

  async setLogoID (id) {
    return await this.store.set(settingKeys.logoID, id)
  }

  async deleteLogoID () {
    return await this.store.delete(settingKeys.logoID)
  }

  async getBackgroundColor () {
    return await this.store.get(settingKeys.backgroundColor)
  }

  async setBackgroundColor (color) {
    return await this.store.set(settingKeys.backgroundColor, color)
  }

  async getEmailEnabled () {
    return await this.store.get(settingKeys.enableEmailNotification)
  }

  async getEmailNotification () {
    const rawResult = await this.store.batchGet([
      settingKeys.enableEmailNotification, settingKeys.sourceEmailRegion, settingKeys.sourceEmailAddress
    ])
    return {
      enable: rawResult[0],
      sourceRegion: rawResult[1],
      sourceEmailAddress: rawResult[2]
    }
  }

  async setEmailNotification ({enable, sourceRegion, sourceEmailAddress}) {
    return await this.store.batchSet({
      [settingKeys.enableEmailNotification]: enable,
      [settingKeys.sourceEmailRegion]: sourceRegion,
      [settingKeys.sourceEmailAddress]: sourceEmailAddress
    })
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
          // no matched item
          return reject(new NotFoundError('no matched item'))
        }
        if (data.Item.value === undefined) {
          // matched, but its value is empty
          resolve('')
        }

        resolve(data.Item.value)
      })
    })
  }

  batchGet (keys) {
    const params = {
      RequestItems: {
        [SettingsTable]: {
          Keys: keys.map(key => { return {key} })
        }
      }
    }
    return new Promise((resolve, reject) => {
      this.awsDynamoDb.batchGet(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (Object.keys(data.UnprocessedKeys).length > 0) {
          // TODO: retry
          return reject(new Error('some keys are unprocessed', data.UnprocessedKeys))
        }

        resolve(keys.map(key => {
          const matched = data.Responses[SettingsTable].find(kv => kv.key === key)
          if (matched === undefined || matched.value === undefined) {
            return ''
          }
          return matched.value
        }))
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

  batchSet (items) {
    const params = {
      RequestItems: {
        [SettingsTable]: Object.keys(items).map(key => {
          return { PutRequest: { Item: {key, value: items[key]} } }
        })
      }
    }

    return new Promise((resolve, reject) => {
      this.awsDynamoDb.batchWrite(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (Object.keys(data.UnprocessedItems).length > 0) {
          // TODO: retry
          return reject(new Error('some items are unprocessed', data.UnprocessedItems))
        }

        resolve()
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
