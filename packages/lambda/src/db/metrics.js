import AWS from 'aws-sdk'
import VError from 'verror'
import { Metric } from 'model/metrics'
import { MetricsTable } from 'utils/const'
import { NotFoundError } from 'utils/errors'
import Mutex from 'utils/mutex'
import generateID from 'utils/generateID'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class MetricsStore {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
    this.mutex = new Mutex()
  }

  query () {
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
      // TODO: use query and do the pagination
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        const metrics = scanResult.Items.map(item => {
          const metric = new Metric(item)
          metric.props = JSON.parse(metric.props)
          return metric
        })
        resolve(metrics)
      })
    })
  }

  get (metricID) {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MetricsTable,
        Key: { metricID }
      }
      this.awsDynamoDb.get(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }

        if (data.Item === undefined) {
          return reject(new NotFoundError('no matched item'))
        }

        const metric = new Metric(data.Item)
        metric.props = JSON.parse(metric.props)
        resolve(metric)
      })
    })
  }

  create (metric) {
    metric.setMetricID(generateID())
    return this.update(metric)
  }

  update (metric) {
    const {metricID, type, title, unit, description, decimalPlaces, status, order, props} = metric
    return new Promise((resolve, reject) => {
      const [updateExp, attrNames, attrValues] = buildUpdateExpression({
        type, title, unit, description, decimalPlaces, status, order, props: JSON.stringify(props)
      })
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
        const updatedMetric = new Metric(data.Attributes)
        updatedMetric['props'] = props  // string -> object
        resolve(updatedMetric)
      })
    })
  }

  delete (metricID) {
    return new Promise((resolve, reject) => {
      const params = {
        Key: { metricID },
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

  async lock (metricID) {
    return await this.mutex.lockWithRetry(MetricsTable, {metricID})
  }

  async unlock (metricID) {
    return await this.mutex.unlock(MetricsTable, {metricID})
  }
}
