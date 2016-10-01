import AWS from 'aws-sdk'
import WError from 'verror'
import { ServiceComponentTable, IncidentTable, IncidentUpdateTable } from './const'
import generateID from './generateID'

const idLength = 12

export const getComponents = () => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB({ region })

  return new Promise((resolve, reject) => {
    const params = {
      TableName: ServiceComponentTable,
      ProjectionExpression: 'componentID, description, #nm, #st',
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
          componentID: {
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
          componentID: compID,
          name: compName,
          status: compStatus,
          description: compDesc
        })
      })

      resolve(components)
    })
  })
}

export const updateComponent = (id, name, description, status) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    if (!id) {
      id = generateID(idLength)
    }
    const params = {
      Key: {
        componentID: id
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
      ReturnValues: 'NONE'
    }
    awsDynamoDb.update(params, (err) => {
      if (err) {
        return reject(new WError(err, 'DynamoDB'))
      }
      resolve()
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
        return reject(new WError(err, 'DynamoDB'))
      }
      resolve(data)
    })
  })
}

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
        return reject(new WError(err, 'DynamoDB'))
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

export const updateIncident = (id, name, status, updatedAt) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    if (!id) {
      id = generateID(idLength)
    }
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
        ':updating': true
      },
      TableName: IncidentTable,
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

export const removeUpdatingFlag = (id) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        incidentID: id
      },
      UpdateExpression: 'set updating = :updating',
      ExpressionAttributeValues: {
        ':updating': false
      },
      TableName: IncidentTable,
      ReturnValues: 'NONE'
    }
    awsDynamoDb.update(params, (err, data) => {
      if (err) {
        return reject(new WError(err, 'DynamoDB'))
      }
      resolve(data)
    })
  })
}

export const updateIncidentUpdate = (incidentID, incidentStatus, message, updatedAt) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    let incidentUpdateID = generateID(idLength)
    const params = {
      Key: {
        incidentID: incidentID,
        incidentUpdateID: incidentUpdateID
      },
      TableName: IncidentUpdateTable,
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
