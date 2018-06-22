import AWS from 'aws-sdk'
import generateID from 'utils/generateID'

export default class Lambda {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.lambda = new AWS.Lambda({ region })
  }

  addPermission (functionName, principal, sourceARN) {
    const params = {
      Action: 'lambda:InvokeFunction',
      FunctionName: functionName,
      Principal: principal,
      SourceArn: sourceARN,
      StatementId: generateID()
    }
    return new Promise((resolve, reject) => {
      this.lambda.addPermission(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve()
      })
    })
  }
}
