import AWS from 'aws-sdk'
import VError from 'verror'
import { MaintenanceTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'

export default class MaintenanceStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MaintenanceTable,
        ProjectionExpression: 'maintenanceID, #nm, #st, startAt, endAt, updatedAt',
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

  getByID (maintenanceID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MaintenanceTable,
        Key: { maintenanceID }
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

  update ({maintenanceID, name, status, startAt, endAt, updatedAt}, updating = false) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { maintenanceID },
        UpdateExpression: `set #n = :n, #s = :s, startAt = :startAt, endAt = :endAt, updatedAt = :updatedAt, updating = :updating`,
        ExpressionAttributeNames: {
          '#n': 'name',
          '#s': 'status'
        },
        ExpressionAttributeValues: {
          ':n': name,
          ':s': status,
          ':startAt': startAt,
          ':endAt': endAt,
          ':updatedAt': updatedAt,
          ':updating': updating
        },
        TableName: MaintenanceTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data.Attributes)
      })
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          maintenanceID: id
        },
        TableName: MaintenanceTable,
        ReturnValues: 'NONE'
      }
      this.awsDynamoDb.delete(params, (err) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve()
      })
    })
  }
}
