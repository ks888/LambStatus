import AWS from 'aws-sdk'
import WError from 'verror'
import { ServiceComponentTable } from './const'
import generateID from './generateID'

export const getComponents = () => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB({ region })

  return new Promise((resolve, reject) => {
    const params = {
      TableName: ServiceComponentTable,
      ProjectionExpression: 'ID, description, #nm, #st',
      ExpressionAttributeNames: {
        '#nm': 'name',
        '#st': 'status'
      }
    }
    awsDynamoDb.scan(params, (err, scanResult) => {
      if (err) {
        return reject(new WError(err, 'DynamoDB'))
      }
      let components = []
      scanResult.Items.forEach((component) => {
        const {
          ID: {
            S: compID
          },
          name: {
            S: compName
          },
          status: {
            S: compStatus
          },
          description: {
            S: compDesc
          }
        } = component
        components.push({
          ID: compID,
          name: compName,
          status: compStatus,
          description: compDesc
        })
      })

      resolve(components)
    })
  })
}

export const putComponent = (name, description, status) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const idLength = 12
    let id = generateID(idLength)
    const params = {
      Key: {
        ID: id
      },
      UpdateExpression: 'set #n = :n, description = :d, #s = :s',
      ExpressionAttributeNames: {
        '#n': 'name',
        '#s': 'status'
      },
      ExpressionAttributeValues: {
        ':n': name,
        ':d': description,
        ':s': status
      },
      TableName: ServiceComponentTable,
      ReturnValues: 'ALL_NEW'
    }
    awsDynamoDb.update(params, (err, data) => {
      if (err) {
        return reject(new WError(err, 'DynamoDB'))
      }
      resolve(data)
    })
  })
}
