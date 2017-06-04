import AWS from 'aws-sdk'

export default class CloudWatch {
  listMetrics (nextToken = undefined, filters = {}) {
    let { AWS_REGION: region } = process.env
    if (filters && filters.region) {
      region = filters.region
    }
    const cloudWatch = new AWS.CloudWatch({region})
    return new Promise((resolve, reject) => {
      let params = {}
      if (nextToken) {
        params.NextToken = nextToken
      }
      // returns up to 500 metrics.
      cloudWatch.listMetrics(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve({
          metrics: result.Metrics,
          nextCursor: result.NextToken
        })
      })
    })
  }

  getMetricData (props, startTime, endTime) {
    const {
      Namespace: namespace,
      MetricName: metricName,
      Dimensions: dimensions,
      Region: region
    } = props
    let period = 60
    let twoWeeksBefore = new Date()
    twoWeeksBefore.setDate(twoWeeksBefore.getDate() - 14)
    if (startTime <= twoWeeksBefore) {
      // Data points with a period of 60 seconds are not available
      period = 300
    }

    const cloudWatch = new AWS.CloudWatch({region})
    return new Promise((resolve, reject) => {
      const params = {
        Namespace: namespace,
        MetricName: metricName,
        Dimensions: dimensions,
        EndTime: endTime,
        StartTime: startTime,
        Period: period,
        Statistics: ['Average']
      }
      cloudWatch.getMetricStatistics(params, (err, result) => {
        if (err) {
          return reject(err)
        }

        const datapoints = result.Datapoints.map((datapoint) => {
          return {
            timestamp: datapoint.Timestamp.toISOString(),
            value: datapoint.Average
          }
        })
        datapoints.sort((a, b) => {
          if (a.timestamp < b.timestamp) return -1
          if (a.timestamp > b.timestamp) return 1
          return 0
        })
        resolve(datapoints)
      })
    })
  }
}
