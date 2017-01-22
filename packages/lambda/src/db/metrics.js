import AWS from 'aws-sdk'
import VError from 'verror'
import { MetricsTable } from 'utils/const'

export default class Metrics {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  listMetrics () {
    return new Promise((resolve, reject) => {
      const params = {
        TableName: MetricsTable,
        ProjectionExpression: 'metricID, #t, props',
        ExpressionAttributeNames: {
          '#t': 'type'
        }
      }
      this.awsDynamoDb.scan(params, (err, scanResult) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        let metrics = []
        scanResult.Items.forEach((metric) => {
          const {
            metricID,
            type,
            props: rawProps
          } = metric
          const props = JSON.parse(rawProps)
          metrics.push({metricID, type, props})
        })

        resolve(metrics)
      })
    })
  }

  postMetric (id, type, props) {
    const propsJSON = JSON.stringify(props)
    return new Promise((resolve, reject) => {
      const params = {
        Key: {
          metricID: id
        },
        UpdateExpression: 'set #t = :t, props = :p',
        ExpressionAttributeNames: {
          '#t': 'type'
        },
        ExpressionAttributeValues: {
          ':t': type,
          ':p': propsJSON
        },
        TableName: MetricsTable,
        ReturnValues: 'ALL_NEW'
      }
      this.awsDynamoDb.update(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve(data.Attributes)
      })
    })
  }
}
