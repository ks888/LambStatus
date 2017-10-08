import AWS from 'aws-sdk'
import VError from 'verror'
import { NotFoundError } from 'utils/errors'
import { buildUpdateExpression } from './utils'

export default class EventsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  query () {
    const attrNames = this.getAttributeNames()
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(),
        ProjectionExpression: `#${attrNames.join(', #')}`,
        ExpressionAttributeNames: attrNames.reduce((prev, attrName) => { prev[`#${attrName}`] = attrName; return prev }, {})
      }
      // TODO: use query and do the pagination
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        const items = scanResult.Items.map(item => this.createEvent(item))
        resolve(items)
      })
    })
  }

  get (id) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: this.getTableName(),
        Key: { [this.getPartitionKeyName()]: id }
      }
      this.awsDynamoDb.get(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (data.Item === undefined) {
          return reject(new NotFoundError('no matched item'))
        }

        resolve(this.createEvent(data.Item))
      })
    })
  }

  create (event) {
    this.setID(event)
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
        resolve(this.createEvent(data.Attributes))
      })
    })
  }

  delete (eventID) {
    const partitionKeyName = this.getPartitionKeyName()
    return new Promise((resolve, reject) => {
      const params = {
        Key: { [partitionKeyName]: eventID },
        TableName: this.getTableName(),
        ReturnValues: 'NONE'
      }
      this.awsDynamoDb.delete(params, (err, data) => {
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

  getAttributeNamesExceptKeys () {
    throw new Error('not implemented')
  }

  getAttributeNames () {
    const partitionKeyName = this.getPartitionKeyName()
    const attrs = this.getAttributeNamesExceptKeys()
    return [partitionKeyName, ...attrs]
  }

  getKeys (event) {
    const partitionKeyName = this.getPartitionKeyName()
    return { [partitionKeyName]: event[partitionKeyName] }
  }

  getAttributesExceptKeys (event) {
    const attrs = this.getAttributeNamesExceptKeys()
    return attrs.reduce((prev, attr) => { prev[attr] = event[attr]; return prev }, {})
  }

  createEvent (item) {
    throw new Error('not implemented')
  }

  setID () {
    throw new Error('not implemented')
  }
}
