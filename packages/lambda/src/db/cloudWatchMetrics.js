import AWS from 'aws-sdk'
import VError from 'verror'
import { CloudWatchMetricsTable } from 'utils/const'

export const postMetric = (id, namespace, metricName, dimensions) => {
  const { AWS_REGION: region } = process.env
  const awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })

  return new Promise((resolve, reject) => {
    const params = {
      Key: {
        metricID: id
      },
      UpdateExpression: 'set namespace = :n, metricName = :m, dimensions = :d',
      ExpressionAttributeValues: {
        ':n': namespace,
        ':m': metricName,
        ':d': dimensions
      },
      TableName: CloudWatchMetricsTable,
      ReturnValues: 'ALL_NEW'
    }
    if (dimensions === '') {
      params.UpdateExpression = 'set namespace = :n, metricName = :m remove dimensions'
      delete params.ExpressionAttributeValues[':d']
    }
    awsDynamoDb.update(params, (err, data) => {
      if (err) {
        return reject(new VError(err, 'DynamoDB'))
      }
      if (!data.Attributes.hasOwnProperty('dimensions')) {
        data.Attributes.dimensions = ''
      }
      resolve(data)
    })
  })
}
