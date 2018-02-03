import AWS from 'aws-sdk'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export const messageType = {
  unknown: 0,
  incidentCraeted: 1,
  incidentUpdated: 2,
  incidentPatched: 3,
  incidentDeleted: 4,
  maintenanceCraeted: 5,
  maintenanceUpdated: 6,
  maintenancePatched: 7,
  maintenanceDeleted: 8,
  metadataChanged: 9
}

export default class SNS {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.sns = new AWS.SNS({ apiVersion: '2010-03-31', region })
  }

  async notifyIncident (message = '', type = messageType.unknown) {
    const topic = await new CloudFormation(stackName).getIncidentNotificationTopic()
    return await this.notifyIncidentToTopic(topic, message, type)
  }

  async notifyIncidentToTopic (topic, message, type) {
    return await this.publish(topic, message, type)
  }

  publish (topic, message, type) {
    const params = {
      Message: JSON.stringify({message, type}),
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
