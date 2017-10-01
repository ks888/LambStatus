import AWS from 'aws-sdk'
import VError from 'verror'
import { MaintenanceUpdate } from 'model/maintenances'
import { MaintenanceUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'
import { buildUpdateExpression } from './utils'

export default class MaintenanceUpdatesStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query (maintenanceID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MaintenanceUpdateTable,
        KeyConditionExpression: 'maintenanceID = :hkey',
        ExpressionAttributeValues: {
          ':hkey': maintenanceID
        },
        ProjectionExpression: 'maintenanceID, maintenanceUpdateID, message, maintenanceStatus, updatedAt'
      }
      this.awsDynamoDb.query(params, (err, queryResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        resolve(queryResult.Items.map(item => new MaintenanceUpdate(item)))
      })
    })
  }

  create (maintenanceUpdate) {
    maintenanceUpdate.setMaintenanceUpdateID(generateID())
    return this.update(maintenanceUpdate)
  }

  update (maintenanceUpdate) {
    const {maintenanceID, maintenanceUpdateID, maintenanceStatus, message, updatedAt} = maintenanceUpdate
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({
        maintenanceStatus, message, updatedAt
      })
      const params = {
        Key: {
          maintenanceID,
          maintenanceUpdateID
        },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: MaintenanceUpdateTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(new MaintenanceUpdate(data.Attributes))
      })
    })
  }

  delete (maintenanceID, maintenanceUpdateIDs) {
    let requests = maintenanceUpdateIDs.map((maintenanceUpdateID) => {
      return { DeleteRequest: { Key: { maintenanceID, maintenanceUpdateID } } }
    })

    return new Promise((resolve, reject) => {
      const params = {
        RequestItems: {
          [MaintenanceUpdateTable]: requests
        }
      }
      this.awsDynamoDb.batchWrite(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data)
      })
    })
  }
}
