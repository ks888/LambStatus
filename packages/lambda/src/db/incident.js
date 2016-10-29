import AWS from 'aws-sdk'
import VError from 'verror'
import { IncidentTable } from 'utils/const'

export const getIncidents = () => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB({ region })

  return new Promise((resolve, reject) => {
    const params = {
      TableName: IncidentTable,
      ProjectionExpression: 'incidentID, #nm, #st, updatedAt',
      ExpressionAttributeNames: {
        '#nm': 'name',
        '#st': 'status'
      },
      ExpressionAttributeValues: {
        ':u': {
          BOOL: false
        }
      },
      FilterExpression: 'updating = :u'
    }
    awsDynamoDb.scan(params, (err, scanResult) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }

      let incidents = []
      scanResult.Items.forEach((incident) => {
        const {
          incidentID: {
            S: incidentID
          },
          name: {
            S: incidentName
          },
          status: {
            S: incidentStatus
          },
          updatedAt: {
            S: incidentUpdatedAt
          }
        } = incident
        incidents.push({
          incidentID: incidentID,
          name: incidentName,
          status: incidentStatus,
          updatedAt: incidentUpdatedAt
        })
      })

      resolve(incidents)
    })
  })
}

export const updateIncident = (id, name, status, updatedAt, updating) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        incidentID: id
      },
      UpdateExpression: 'set #n = :n, #s = :s, updatedAt = :updatedAt, updating = :updating',
      ExpressionAttributeNames: {
        '#n': 'name',
        '#s': 'status'
      },
      ExpressionAttributeValues: {
        ':n': name,
        ':s': status,
        ':updatedAt': updatedAt,
        ':updating': updating
      },
      TableName: IncidentTable,
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

export const deleteIncident = (id) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        incidentID: id
      },
      TableName: IncidentTable,
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
