import AWS from 'aws-sdk'

export default class CloudWatch {
  async listMetrics () {
    let metrics = []
    let nextToken = null
    while (true) {
      const result = await this.listSomeMetrics(nextToken)
      metrics = metrics.concat(result.Metrics)
      if (!result.NextToken) {
        return metrics
      }
      nextToken = result.NextToken
    }
  }

  listSomeMetrics (nextToken) {
    const cloudWatch = new AWS.CloudWatch()
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
        resolve(result)
      })
    })
  }

  getMetricData (props, startTime, endTime) {
    const {
      Namespace: namespace,
      MetricName: metricName,
      Dimensions: dimensions
    } = props
    let period = 60
    let twoWeeksBefore = new Date()
    twoWeeksBefore.setDate(twoWeeksBefore.getDate() - 14)
    if (startTime <= twoWeeksBefore) {
      // Data points with a period of 60 seconds are not available
      period = 300
    }

    const cloudWatch = new AWS.CloudWatch()
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
