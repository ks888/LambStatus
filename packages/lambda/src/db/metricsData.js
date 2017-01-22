import AWS from 'aws-sdk'
import VError from 'verror'
import { MetricsDataTable } from 'utils/const'

export default class MetricsData {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsDynamoDb = new AWS.DynamoDB.DocumentClient({ region })
  }

  postMetricData (id, datapoints) {
    return new Promise((resolve, reject) => {
      const putRequests = datapoints.map((datapoint) => {
        return {
          PutRequest: {
            Item: {
              metricID: id,
              timestamp: datapoint.timestamp,
              value: datapoint.value
            }
          }
        }
      })
      const params = {
        RequestItems: { [MetricsDataTable]: putRequests }
      }
      this.awsDynamoDb.batchWrite(params, (err, data) => {
        if (err) {
          return reject(new VError(err, 'DynamoDB'))
        }
        resolve()
      })
    })
  }
}
