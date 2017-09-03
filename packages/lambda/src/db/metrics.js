import AWS from 'aws-sdk'
import VError from 'verror'
import { MetricsTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class MetricsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  getAll () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MetricsTable,
        ProjectionExpression: 'metricID, #t, title, #u, description, decimalPlaces, #s, #or, props',
        ExpressionAttributeNames: {
          '#t': 'type',
          '#u': 'unit',
          '#s': 'status',
          '#or': 'order'
        }
      }
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        let metrics = []
        scanResult.Items.forEach((metric) => {
          fillInsufficientProps({unit: '', description: '', decimalPlaces: 0}, metric)
          metric['props'] = JSON.parse(metric['props'])
          metrics.push(metric)
        })

        resolve(metrics)
      })
    })
  }

  getByID (metricID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MetricsTable,
        KeyConditionExpression: 'metricID = :hkey',
        ExpressionAttributeValues: {
          ':hkey': metricID
        },
        ProjectionExpression: 'metricID, #t, title, #u, description, decimalPlaces, #s, #or, props',
        ExpressionAttributeNames: {
          '#t': 'type',
          '#u': 'unit',
          '#s': 'status',
          '#or': 'order'
        }
      }
      this.awsDynamoDb.query(params, (err, queryResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (queryResult.Items.length === 0) {
          return reject(new NotFoundError('no matched item'))
        }

        queryResult.Items.forEach(item => {
          fillInsufficientProps({unit: '', description: '', decimalPlaces: 0}, item)
          item['props'] = JSON.parse(item['props'])
        })

        resolve(queryResult.Items)
      })
    })
  }

  update ({metricID, type, title, unit, description, decimalPlaces, status, order, props}) {
    const [updateExp, attrNames, attrValues] = buildUpdateExpression({
      type, title, unit, description, decimalPlaces, status, order, props: JSON.stringify(props)
    })
    return new Promise((resolve, reject) => {
      const params = {
        Key: { metricID },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
        TableName: MetricsTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        fillInsufficientProps({unit, description}, data.Attributes)
        data.Attributes['props'] = props  // string -> object
        resolve(data.Attributes)
      })
    })
  }

  delete (id) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          metricID: id
        },
        TableName: MetricsTable,
        ReturnValues: 'NONE'
      }
      this.awsDynamoDb.delete(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data)
      })
    })
  }
}
