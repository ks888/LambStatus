import AWS from 'aws-sdk'
import VError from 'verror'
import { IncidentUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class IncidentUpdatesStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getByIncidentID (incidentID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: IncidentUpdateTable,
        KeyConditionExpression: 'incidentID = :hkey',
        ExpressionAttributeValues: {
          ':hkey': incidentID
        },
        ProjectionExpression: 'incidentID, incidentUpdateID, message, incidentStatus, updatedAt'
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

  update (incidentID, incidentStatus, message, updatedAt) {
    return new Promise((resolve, reject) => {
      let incidentUpdateID = generateID()
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({
        incidentStatus, message, updatedAt
      })
      const params = {
        Key: {
          incidentID,
          incidentUpdateID
        },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: IncidentUpdateTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        fillInsufficientProps({message: ''}, data.Attributes)
        resolve(data)
      })
    })
  }

  delete (incidentID, incidentUpdates) {
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
      this.awsDynamoDb.batchWrite(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data)
      })
    })
  }
}
