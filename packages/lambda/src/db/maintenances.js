import AWS from 'aws-sdk'
import VError from 'verror'
import { Maintenance } from 'model/maintenances'
import { MaintenanceTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'
import generateID from 'utils/generateID'

export default class MaintenanceStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MaintenanceTable,
        ProjectionExpression: 'maintenanceID, #nm, #st, startAt, endAt, updatedAt',
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

        const maints = scanResult.Items.map(maint => new Maintenance(maint))
        resolve(maints)
      })
    })
  }

  get (maintenanceID) {
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

        resolve(new Maintenance(data.Item))
      })
    })
  }

  create (maintenance) {
    maintenance.setMaintenanceID(generateID())
    return this.update(maintenance)
  }

  update (maintenance) {
    const {maintenanceID, name, status, startAt, endAt, updatedAt} = maintenance
    return new Promise((resolve, reject) => {
      const params = {
        Key: { maintenanceID },
        UpdateExpression: `set #n = :n, #s = :s, startAt = :startAt, endAt = :endAt, updatedAt = :updatedAt`,
        ExpressionAttributeNames: {
          '#n': 'name',
          '#s': 'status'
        },
        ExpressionAttributeValues: {
          ':n': name,
          ':s': status,
          ':startAt': startAt,
          ':endAt': endAt,
          ':updatedAt': updatedAt
        },
        TableName: MaintenanceTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(new Maintenance(data.Attributes))
      })
    })
  }

  delete (maintenanceID) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { maintenanceID },
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
