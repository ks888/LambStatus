import AWS from 'aws-sdk'
import VError from 'verror'
import { IncidentUpdate } from 'model/incidents'
import { IncidentUpdateTable } from 'utils/const'
import generateID from 'utils/generateID'
import { buildUpdateExpression } from './utils'

export default class IncidentUpdatesStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query (incidentID) {
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

        resolve(queryResult.Items.map(item => new IncidentUpdate(item)))
      })
    })
  }

  create (incidentUpdate) {
    incidentUpdate.setIncidentUpdateID(generateID())
    return this.update(incidentUpdate)
  }

  update (incidentUpdate) {
    const {incidentID, incidentUpdateID, incidentStatus, message, updatedAt} = incidentUpdate
    return new Promise((resolve, reject) => {
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
        resolve(new IncidentUpdate(data.Attributes))
      })
    })
  }

  delete (incidentID, incidentUpdateIDs) {
    let requests = incidentUpdateIDs.map((incidentUpdateID) => {
      return { DeleteRequest: { Key: { incidentID, incidentUpdateID } } }
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
