import AWS from 'aws-sdk'
import VError from 'verror'
import { IncidentTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'

export default class IncidentsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: IncidentTable,
        ProjectionExpression: 'incidentID, #nm, #st, updatedAt',
        ExpressionAttributeNames: {
          '#nm': 'name',
          '#st': 'status'
        },
        ExpressionAttributeValues: {
          ':u': false
        },
        FilterExpression: 'updating = :u'
      }
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        resolve(scanResult.Items)
      })
    })
  }

  getByID (incidentID) {
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

        resolve(data.Item)
      })
    })
  }

  update ({incidentID, name, status, updatedAt}, updating = false) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { incidentID },
        UpdateExpression: 'set #n = :n, #s = :s, updatedAt = :updatedAt, updating = :updating',
        ExpressionAttributeNames: {
          '#n': 'name',
          '#s': 'status'
        },
        ExpressionAttributeValues: {
          ':n': name,
          ':s': status,
          ':updatedAt': updatedAt,
          ':updating': updating
        },
        TableName: IncidentTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data)
      })
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          incidentID: id
        },
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
