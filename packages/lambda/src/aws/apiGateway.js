import AWS from 'aws-sdk'

export default class APIGateway {
  constructor (region) {
    this.apiGateway = new AWS.APIGateway({region})
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

  getApiKeys (queryName) {
    const params = {
      nameQuery: queryName,
      includeValues: true
    }
    return new Promise((resolve, reject) => {
      this.apiGateway.getApiKeys(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.items)
      })
    })
  }

  getApiKey (id) {
    const params = { apiKey: id }
    return new Promise((resolve, reject) => {
      this.apiGateway.getApiKey(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  createApiKey (name) {
    const params = { name, enabled: true }
    return new Promise((resolve, reject) => {
      this.apiGateway.createApiKey(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
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
}
