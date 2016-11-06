import AWS from 'aws-sdk'
import VError from 'verror'
import { IncidentUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'
import { NotFoundError } from 'utils/errors'

export const getIncidentUpdates = (incidentID) => {
  const region = process.env.AWS_DEFAULT_REGION
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      TableName: IncidentUpdateTable,
      KeyConditionExpression: 'incidentID = :hkey',
      ExpressionAttributeValues: {
        ':hkey': incidentID
      },
      ProjectionExpression: 'incidentID, incidentUpdateID, message, incidentStatus, updatedAt'
    }
    awsDynamoDb.query(params, (err, queryResult) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }

      if (queryResult.Items.length === 0) {
        return reject(new NotFoundError('no matched item'))
      }

      resolve(queryResult.Items)
    })
  })
}

export const updateIncidentUpdate = (incidentID, incidentStatus, message, updatedAt) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    let incidentUpdateID = generateID()
    const params = {
      Key: {
        incidentID: incidentID,
        incidentUpdateID: incidentUpdateID
      },
      UpdateExpression: 'set incidentStatus = :i, updatedAt = :u, message = :m',
      ExpressionAttributeValues: {
        ':i': incidentStatus,
        ':u': updatedAt,
        ':m': message
      },
      TableName: IncidentUpdateTable,
      ReturnValues: 'ALL_NEW'
    }
    awsDynamoDb.update(params, (err, data) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      resolve(data)
    })
  })
}

export const deleteIncidentUpdates = (incidentID, incidentUpdates) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  let requests = incidentUpdates.map((incidentUpdate) => {
    return {
      DeleteRequest: {
        Key: {
          incidentID: incidentID,
          incidentUpdateID: incidentUpdate.incidentUpdateID
        }
      }
    }
  })

  return new Promise((resolve, reject) => {
    const params = {
      RequestItems: {
        [IncidentUpdateTable]: requests
      }
    }
    awsDynamoDb.batchWrite(params, (err, data) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      resolve(data)
    })
  })
}
