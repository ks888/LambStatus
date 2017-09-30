import AWS from 'aws-sdk'
import VError from 'verror'
import { Incident } from 'model/incidents'
import { IncidentTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'
import generateID from 'utils/generateID'

export default class IncidentsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: IncidentTable,
        ProjectionExpression: 'incidentID, #nm, #st, updatedAt',
        ExpressionAttributeNames: {
          '#nm': 'name',
          '#st': 'status'
        }
      }
      // TODO: use query and do the pagination
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        const incidents = scanResult.Items.map(incident => new Incident(incident))
        resolve(incidents)
      })
    })
  }

  get (incidentID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: IncidentTable,
        Key: { incidentID }
      }
      this.awsDynamoDb.get(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (data.Item === undefined) {
          return reject(new NotFoundError('no matched item'))
        }

        resolve(new Incident(data.Item))
      })
    })
  }

  create (incident) {
    incident.setIncidentID(generateID())
    return this.update(incident)
  }

  update (incident) {
    const {incidentID, name, status, updatedAt} = incident
    return new Promise((resolve, reject) => {
      const params = {
        Key: { incidentID },
        UpdateExpression: 'set #n = :n, #s = :s, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#n': 'name',
          '#s': 'status'
        },
        ExpressionAttributeValues: {
          ':n': name,
          ':s': status,
          ':updatedAt': updatedAt
        },
        TableName: IncidentTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(new Incident(data.Attributes))
      })
    })
  }

  delete (incidentID) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { incidentID },
        TableName: IncidentTable,
        ReturnValues: 'NONE'
      }
      this.awsDynamoDb.delete(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data)
      })
    })
  }
}
