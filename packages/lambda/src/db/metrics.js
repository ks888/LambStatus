import AWS from 'aws-sdk'
import VError from 'verror'
import { MetricsTable } from 'utils/const'
import { buildUpdateExpression, fillInsufficientProps } from './utils'

export default class Metrics {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  listMetrics () {
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

  postMetric (id, type, title, unit, description, status, props) {
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
}
