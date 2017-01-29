import AWS from 'aws-sdk'

export const listMetrics = async (namespace) => {
  const metrics = []
  let nextToken = null
  while (true) {
    const result = await listSomeMetrics(namespace, nextToken)
    metrics.concat(result.Metrics)
    if (!result.NextToken) {
      return metrics
    }
    nextToken = result.NextToken
  }
}

// listMetrics operation returns up to 500 metrics.
export const listSomeMetrics = (namespace, nextToken) => {
  const cloudWatch = new AWS.CloudWatch()
  return new Promise((resolve, reject) => {
    let params = {}
    if (namespace) {
      params.Namespace = namespace
    }
    if (nextToken) {
      params.NextToken = nextToken
    }
    cloudWatch.listMetrics(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

export const getMetricData = (props, startTime, endTime) => {
  const {
    Namespace: namespace,
    MetricName: metricName,
    Dimensions: dimensions
  } = props
  const cloudWatch = new AWS.CloudWatch()
  return new Promise((resolve, reject) => {
    const params = {
      Namespace: namespace,
      MetricName: metricName,
      Dimensions: dimensions,
      EndTime: endTime,
      StartTime: startTime,
      Period: 60,
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
