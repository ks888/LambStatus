import AWS from 'aws-sdk'
import VError from 'verror'
import { MaintenanceTable } from 'utils/const'

export default class MaintenanceStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MaintenanceTable,
        ProjectionExpression: 'maintenanceID, #nm, #st, startAt, endAt',
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
        KeyConditionExpression: 'maintenanceID = :hkey',
        ExpressionAttributeValues: {
          ':hkey': maintenanceID
        },
        ProjectionExpression: 'maintenanceID, #nm, #st, startAt, endAt',
        ExpressionAttributeNames: {
          '#nm': 'name',
          '#st': 'status'
        }
      }
      this.awsDynamoDb.query(params, (err, queryResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        resolve(queryResult.Items)
      })
    })
  }

  update (id, name, status, startAt, endAt) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          maintenanceID: id
        },
        UpdateExpression: 'set #n = :n, #s = :s, startAt = :startAt, endAt = :endAt',
        ExpressionAttributeNames: {
          '#n': 'name',
          '#s': 'status'
        },
        ExpressionAttributeValues: {
          ':n': name,
          ':s': status,
          ':startAt': startAt,
          ':endAt': endAt
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
