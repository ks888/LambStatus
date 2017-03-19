import AWS from 'aws-sdk'
import VError from 'verror'
import { ServiceComponentTable } from 'utils/const'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class ComponentsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: ServiceComponentTable,
        ProjectionExpression: 'componentID, description, #nm, #st, #or',
        ExpressionAttributeNames: {
          '#nm': 'name',
          '#st': 'status',
          '#or': 'order'
        }
      }
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        scanResult.Items.forEach(item => {
          fillInsufficientProps({description: ''}, item)
        })

        resolve(scanResult.Items)
      })
    })
  }

  getByID (componentID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: ServiceComponentTable,
        KeyConditionExpression: 'componentID = :hkey',
        ExpressionAttributeValues: {
          ':hkey': componentID
        },
        ProjectionExpression: 'componentID, description, #nm, #st, #or',
        ExpressionAttributeNames: {
          '#nm': 'name',
          '#st': 'status',
          '#or': 'order'
        }
      }
      this.awsDynamoDb.query(params, (err, queryResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        queryResult.Items.forEach(item => {
          fillInsufficientProps({description: ''}, item)
        })

        resolve(queryResult.Items)
      })
    })
  }

  update (id, name, description, status, order) {
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({
        name, description, status, order
      })
      const params = {
        Key: { componentID: id },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: ServiceComponentTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        fillInsufficientProps({description}, data.Attributes)
        resolve(data.Attributes)
      })
    })
  }

  updateStatus (id, status) {
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({ status })
      const params = {
        Key: {
          componentID: id
        },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: ServiceComponentTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        fillInsufficientProps({description: ''}, data.Attributes)
        resolve(data.Attributes)
      })
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          componentID: id
        },
        TableName: ServiceComponentTable,
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
