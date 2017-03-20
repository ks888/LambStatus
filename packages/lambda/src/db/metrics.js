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
        ProjectionExpression: 'metricID, #t, title, #u, description, #s, props',
        ExpressionAttributeNames: {
          '#t': 'type',
          '#s': 'status',
          '#u': 'unit'
        }
      }
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        let metrics = []
        scanResult.Items.forEach((metric) => {
          fillInsufficientProps({type: '', title: '', unit: '', description: '', status: '', props: null}, metric)
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
        ProjectionExpression: 'metricID, #t, title, #u, description, #s, props',
        ExpressionAttributeNames: {
          '#t': 'type',
          '#s': 'status',
          '#u': 'unit'
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
          fillInsufficientProps({type: '', title: '', unit: '', description: '', status: '', props: null}, item)
        })

        resolve(queryResult.Items)
      })
    })
  }

  update (id, type, title, unit, description, status, props) {
    const [updateExp, attrNames, attrValues] = buildUpdateExpression({
      type, title, unit, description, status, props: JSON.stringify(props)
    })
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          metricID: id
        },
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
        fillInsufficientProps({type, title, unit, description, status, props}, data.Attributes)
        data.Attributes['props'] = props  // object representation
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
