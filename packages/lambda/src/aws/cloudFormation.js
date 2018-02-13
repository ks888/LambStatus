import AWS from 'aws-sdk'

export default class CloudFormation {
  constructor (stackName) {
    const { AWS_REGION: region } = process.env
    this.cloudFormation = new AWS.CloudFormation({ region })
    this.stackName = stackName
  }

  describe () {
    const params = { StackName: this.stackName }
    return new Promise((resolve, reject) => {
      this.cloudFormation.describeStacks(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        if (!data) {
          return reject(new Error('describeStacks returned no data'))
        }
        const { Stacks: stacks } = data
        if (!stacks || stacks.length !== 1) {
          return reject(new Error('describeStacks unexpected number of stacks'))
        }
        const stack = stacks[0]
        resolve(stack)
      })
    })
  }

  async getOutputValue (key) {
    if (!this.stack) {
      this.stack = await this.describe()
    }

    let value
    this.stack.Outputs.some(output => {
      if (output.OutputKey === key) {
        value = output.OutputValue
        return true
      }
    })
    if (!value) {
      throw new Error(`failed to get output value (key: ${key}`)
    }
    return value
  }

  async getAdminPageCloudFrontURL () {
    const key = 'AdminPageCloudFrontURL'
    return await this.getOutputValue(key)
  }

  async getAdminPageBucketName () {
    const key = 'AdminPageS3BucketName'
    return await this.getOutputValue(key)
  }

  async getStatusPageCloudFrontURL () {
    const key = 'StatusPageCloudFrontURL'
    return await this.getOutputValue(key)
  }

  async getStatusPageBucketName () {
    const key = 'StatusPageS3BucketName'
    return await this.getOutputValue(key)
  }

  async getIncidentNotificationTopic () {
    const key = 'IncidentNotificationTopic'
    return await this.getOutputValue(key)
  }

  async getUsagePlanID () {
    const key = 'UsagePlanID'
    return await this.getOutputValue(key)
  }

  async getUserPoolID () {
    const key = 'UserPoolID'
    return await this.getOutputValue(key)
  }

  async getSubscribersPoolID () {
    const key = 'SubscribersPoolID'
    return await this.getOutputValue(key)
  }

  async getSubscribersPoolClientID () {
    const key = 'SubscribersPoolClientID'
    return await this.getOutputValue(key)
  }

  async getBouncesAndComplaintsHandlerArn () {
    const key = 'BouncesAndComplaintsHandlerArn'
    return await this.getOutputValue(key)
  }
}
