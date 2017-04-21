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
}
