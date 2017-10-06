import AWS from 'aws-sdk'
import { NotFoundError } from 'utils/errors'

export class APIKey {
  constructor ({id, name, value, createdDate, lastUpdatedDate}) {
    this.id = id
    this.name = name
    this.value = value
    this.createdDate = createdDate
    this.lastUpdatedDate = lastUpdatedDate
  }

  objectify () {
    return {
      id: this.id,
      name: this.name,
      value: this.value,
      createdDate: this.createdDate,
      lastUpdatedDate: this.lastUpdatedDate
    }
  }
}

export default class APIGateway {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.apiGateway = new AWS.APIGateway({ region })
  }

  deploy (restApiId, stageName) {
    const params = { restApiId, stageName }
    return new Promise((resolve, reject) => {
      this.apiGateway.createDeployment(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  queryEnabledApiKey (queryName) {
    const params = {
      nameQuery: queryName,
      includeValues: true
    }
    return new Promise((resolve, reject) => {
      this.apiGateway.getApiKeys(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        const keys = []
        result.items.forEach(key => {
          if (!key.enabled) return
          keys.push(new APIKey(key))
        })
        resolve(keys)
      })
    })
  }

  getApiKey (id) {
    const params = { apiKey: id }
    return new Promise((resolve, reject) => {
      this.apiGateway.getApiKey(params, (err, result) => {
        if (err) {
          if (err.name === 'NotFoundException') {
            return reject(new NotFoundError(err.message))
          }
          return reject(err)
        }
        resolve(new APIKey(result))
      })
    })
  }

  async createApiKeyWithUsagePlan (keyName, usagePlanID) {
    const newAPIKey = await this.createApiKey(keyName)
    await this.createUsagePlanKey(newAPIKey.id, usagePlanID)
    return newAPIKey
  }

  createApiKey (name) {
    const params = { name, enabled: true }
    return new Promise((resolve, reject) => {
      this.apiGateway.createApiKey(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(new APIKey(result))
      })
    })
  }

  createUsagePlanKey (keyId, usagePlanId) {
    const params = { usagePlanId, keyId, keyType: 'API_KEY' }
    return new Promise((resolve, reject) => {
      this.apiGateway.createUsagePlanKey(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  // disableAndDeleteApiKey disables the api key first.
  // Since the deleted key often can be used for a while, it's better to use this method to delete the key.
  async disableAndDeleteApiKey (id) {
    await this.disableApiKey(id)
    await this.deleteApiKey(id)
  }

  disableApiKey (id) {
    const params = {
      apiKey: id,
      patchOperations: [{
        op: 'replace',
        path: '/enabled',
        value: 'false'
      }]
    }
    return new Promise((resolve, reject) => {
      this.apiGateway.updateApiKey(params, (err, result) => {
        if (err) {
          if (err.name === 'NotFoundException') {
            return reject(new NotFoundError(err.message))
          }
          return reject(err)
        }
        resolve()
      })
    })
  }

  deleteApiKey (id) {
    const params = { apiKey: id }
    return new Promise((resolve, reject) => {
      this.apiGateway.deleteApiKey(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
