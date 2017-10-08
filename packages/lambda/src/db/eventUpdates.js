import AWS from 'aws-sdk'
import VError from 'verror'
import { buildUpdateExpression } from './utils'

export default class EventUpdatesStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query (id) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(),
        KeyConditionExpression: `${this.getPartitionKeyName()} = :hkey`,
        ExpressionAttributeValues: {
          ':hkey': id
        },
        ProjectionExpression: this.getAttributeNames().join(', ')
      }
      this.awsDynamoDb.query(params, (err, queryResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        resolve(queryResult.Items.map(item => this.createEventUpdate(item)))
      })
    })
  }

  create (event) {
    this.setUpdateID(event)
    return this.update(event)
  }

  update (event) {
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression(this.getAttributesExceptKeys(event))
      const params = {
        Key: this.getKeys(event),
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: this.getTableName(),
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(this.createEventUpdate(data.Attributes))
      })
    })
  }

  delete (eventID, eventUpdateIDs) {
    const partitionKeyName = this.getPartitionKeyName()
    const sortKeyName = this.getSortKeyName()
    let requests = eventUpdateIDs.map((eventUpdateID) => {
      return {DeleteRequest: {Key: {
        [partitionKeyName]: eventID,
        [sortKeyName]: eventUpdateID
      }}}
    })

    return new Promise((resolve, reject) => {
      const params = {
        RequestItems: {
          [this.getTableName()]: requests
        }
      }
      this.awsDynamoDb.batchWrite(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve()
      })
    })
  }

  getTableName () {
    throw new Error('not implemented')
  }

  getPartitionKeyName () {
    throw new Error('not implemented')
  }

  getSortKeyName () {
    throw new Error('not implemented')
  }

  getAttributeNamesExceptKeys () {
    throw new Error('not implemented')
  }

  getAttributeNames () {
    const partitionKeyName = this.getPartitionKeyName()
    const sortKeyName = this.getSortKeyName()
    const attrs = this.getAttributeNamesExceptKeys()
    return [partitionKeyName, sortKeyName, ...attrs]
  }

  getKeys (event) {
    const partitionKeyName = this.getPartitionKeyName()
    const sortKeyName = this.getSortKeyName()
    return [partitionKeyName, sortKeyName].reduce((prev, attr) => { prev[attr] = event[attr]; return prev }, {})
  }

  getAttributesExceptKeys (event) {
    const attrs = this.getAttributeNamesExceptKeys()
    return attrs.reduce((prev, attr) => { prev[attr] = event[attr]; return prev }, {})
  }

  createEventUpdate () {
    throw new Error('not implemented')
  }

  setUpdateID () {
    throw new Error('not implemented')
  }
}
