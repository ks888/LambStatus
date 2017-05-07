import AWS from 'aws-sdk'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export default class SNS {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31', region })
  }

  async notifyIncident (message) {
    const topic = await new CloudFormation(stackName).getIncidentNotificationTopic()
    return await this.publish(topic, message)
  }

  publish (topic, message) {
    const params = {
      Message: JSON.stringify({default: JSON.stringify(message)}),
      MessageStructure: 'json',
      TopicArn: topic
    }
    return new Promise((resolve, reject) => {
      this.sns.publish(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve(data)
      })
    })
  }
}
