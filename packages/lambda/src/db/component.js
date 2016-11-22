import AWS from 'aws-sdk'
import VError from 'verror'
import { ServiceComponentTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'

export const getComponents = () => {
  const region = process.env.AWS_DEFAULT_REGION
  const awsDynamoDb = new AWS.DynamoDB({ region })

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
    awsDynamoDb.scan(params, (err, scanResult) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      let components = []
      scanResult.Items.forEach((component) => {
        const {
          componentID: {
            S: componentID
          },
          name: {
            S: name
          },
          status: {
            S: status
          }
        } = component
        const description = component.hasOwnProperty('description') ? component.description.S : ''
        const order = component.hasOwnProperty('order') ? Number(component.order.N) : 0
        components.push({componentID, name, status, description, order})
      })

      resolve(components)
    })
  })
}

export const getComponent = (componentID) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      TableName: ServiceComponentTable,
      KeyConditionExpression: 'componentID = :hkey',
      ExpressionAttributeValues: {
        ':hkey': componentID
      },
      ProjectionExpression: 'componentID, description, #nm, #st',
      ExpressionAttributeNames: {
        '#nm': 'name',
        '#st': 'status'
      }
    }
    awsDynamoDb.query(params, (err, queryResult) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }

      if (queryResult.Items.length === 0) {
        return reject(new NotFoundError('no matched item'))
      }

      queryResult.Items.forEach(item => {
        if (!item.hasOwnProperty('description')) {
          item.description = ''
        }
      })

      resolve(queryResult.Items)
    })
  })
}

export const updateComponent = (id, name, description, status) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        componentID: id
      },
      UpdateExpression: 'set #n = :n, #s = :s',
      ExpressionAttributeNames: {
        '#n': 'name',
        '#s': 'status'
      },
      ExpressionAttributeValues: {
        ':n': name,
        ':s': status
      },
      TableName: ServiceComponentTable,
      ReturnValues: 'ALL_NEW'
    }
    if (description !== '') {
      params.UpdateExpression = 'set #n = :n, description = :d, #s = :s'
      params.ExpressionAttributeValues[':d'] = description
    }
    awsDynamoDb.update(params, (err, data) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      if (!data.Attributes.hasOwnProperty('description')) {
        data.Attributes.description = ''
      }
      resolve(data)
    })
  })
}

export const updateComponentStatus = (id, status) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        componentID: id
      },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: {
        '#s': 'status'
      },
      ExpressionAttributeValues: {
        ':s': status
      },
      TableName: ServiceComponentTable,
      ReturnValues: 'ALL_NEW'
    }
    awsDynamoDb.update(params, (err, data) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      if (!data.Attributes.hasOwnProperty('description')) {
        data.Attributes.description = ''
      }
      resolve(data)
    })
  })
}

export const deleteComponent = (id) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        componentID: id
      },
      TableName: ServiceComponentTable,
      ReturnValues: 'NONE'
    }
    awsDynamoDb.delete(params, (err, data) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      resolve(data)
    })
  })
}
