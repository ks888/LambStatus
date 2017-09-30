import AWS from 'aws-sdk'
import VError from 'verror'
import { ServiceComponentTable } from 'utils/const'
import { Component } from 'model/components'
import { NotFoundError } from 'utils/errors'
import generateID from 'utils/generateID'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class ComponentsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query () {
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
      // TODO: use query and do the pagination
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        const components = scanResult.Items.map(comp => new Component(comp))
        resolve(components)
      })
    })
  }

  get (componentID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: ServiceComponentTable,
        Key: { componentID }
      }
      this.awsDynamoDb.get(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (data.Item === undefined) {
          return reject(new NotFoundError('no matched item'))
        }

        resolve(new Component(data.Item))
      })
    })
  }

  create (component) {
    component.setComponentID(generateID())
    return this.update(component)
  }

  update (component) {
    const {componentID, name, description, status, order} = component
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({
        name, description, status, order
      })
      const params = {
        Key: { componentID },
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
        resolve(new Component(data.Attributes))
      })
    })
  }

  updateStatus (componentID, status) {
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({ status })
      const params = {
        Key: { componentID },
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
        resolve(new Component(data.Attributes))
      })
    })
  }

  delete (componentID) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { componentID },
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
