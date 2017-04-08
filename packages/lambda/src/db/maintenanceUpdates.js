import AWS from 'aws-sdk'
import VError from 'verror'
import { MaintenanceUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class MaintenanceUpdatesStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getByMaintenanceID (maintenanceID) {
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

        queryResult.Items.forEach(item => {
          fillInsufficientProps({message: ''}, item)
        })

        resolve(queryResult.Items)
      })
    })
  }

  update (maintenanceID, maintenanceStatus, message, updatedAt) {
    return new Promise((resolve, reject) => {
      let maintenanceUpdateID = generateID()
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
        fillInsufficientProps({message: ''}, data.Attributes)
        resolve(data.Attributes)
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
