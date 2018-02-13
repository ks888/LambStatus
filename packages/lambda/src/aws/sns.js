import AWS from 'aws-sdk'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export const messageType = {
  unknown: 0,
  // incidentCreated means a new incident is just created. Message has its id.
  incidentCreated: 1,
  // incidentUpdated means the existing incident has a update. Message has its id.
  incidentUpdated: 2,
  // incidentPatched means one of the incident updates is changed. Message has its id.
  incidentPatched: 3,
  // incidentDeleted means the incident is deleted. Message has its id.
  incidentDeleted: 4,
  // maintenanceCreated means a new maintenance is just created. Message has its id.
  maintenanceCreated: 5,
  // maintenanceUpdated means the existing maintenance has a update. Message has its id.
  maintenanceUpdated: 6,
  // maintenancePatched means one of the maintenance updates is changed. Message has its id.
  maintenancePatched: 7,
  // maintenanceDeleted means the maintenance is deleted. Message has its id.
  maintenanceDeleted: 8,
  // metadataChanged means some metadata like service name is change. No message rule so far.
  metadataChanged: 9
}

export default class SNS {
  constructor (region) {
    if (region === undefined) {
      region = process.env.AWS_REGION
    }
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

  async listTopics () {
    let nextToken
    let topics = []
    while (true) {
      const data = await this.listTopicsWithPagination(nextToken)
      topics = topics.concat(data.Topics.map(topic => topic.TopicArn))

      if (data.NextToken === undefined) {
        return topics
      }
      nextToken = data.NextToken
    }
  }

  listTopicsWithPagination (nextToken) {
    const params = {NextToken: nextToken}
    return new Promise((resolve, reject) => {
      this.sns.listTopics(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve(data)
      })
    })
  }

  createTopic (topicName) {
    const params = {Name: topicName}
    return new Promise((resolve, reject) => {
      this.sns.createTopic(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve(data.TopicArn)
      })
    })
  }

  subscribeWithLambda (topicARN, lambdaARN) {
    const params = {TopicArn: topicARN, Protocol: 'lambda', Endpoint: lambdaARN}
    return new Promise((resolve, reject) => {
      this.sns.subscribe(params, (error, data) => {
        if (error) {
          return reject(error)
        }
        resolve(data.SubscriptionArn)
      })
    })
  }
}
