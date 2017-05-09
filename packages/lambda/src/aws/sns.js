import AWS from 'aws-sdk'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export default class SNS {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31', region })
  }

  async notifyIncident (message = '') {
    const topic = await new CloudFormation(stackName).getIncidentNotificationTopic()
    return await this.notifyIncidentToTopic(topic, message)
  }

  async notifyIncidentToTopic (topic, message = '') {
    // TODO: this method is called even when the metadata like service name is updated.
    // In such a case, no need to publish to all subscribers including SES.
    // Maybe it's better to categorize the messages.
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
