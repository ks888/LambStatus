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

  getUsagePlans () {
    const params = {}
    return new Promise((resolve, reject) => {
      this.apiGateway.getUsagePlans(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.items)
      })
    })
  }

  createUsagePlan (name, apiId) {
    const params = {
      name,
      apiStages: [{apiId, stage: 'prod'}]
    }
    return new Promise((resolve, reject) => {
      this.apiGateway.createUsagePlan(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  getRestApis () {
    const params = {}
    return new Promise((resolve, reject) => {
      this.apiGateway.getRestApis(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.items)
      })
    })
  }

  createUsagePlanKey (key, usagePlan) {
    const params = {
      usagePlanId: usagePlan.id,
      keyId: key.id,
      keyType: 'API_KEY'
    }
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
