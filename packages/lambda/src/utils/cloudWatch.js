import AWS from 'aws-sdk'

export const listMetrics = (namespace) => {
  const cloudWatch = new AWS.CloudWatch()
  return new Promise((resolve, reject) => {
    let params = {}
    if (namespace) {
      params.Namespace = namespace
    }
    cloudWatch.listMetrics(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result.Metrics)
    })
  })
}

export const getMetricData = (props) => {
  const {
    Namespace: namespace,
    MetricName: metricName,
    Dimensions: dimensions
  } = props
  const cloudWatch = new AWS.CloudWatch()
  const endTime = new Date()
  const startTime = new Date(endTime.getTime())
  startTime.setDate(startTime.getDate() - 1)
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
      resolve(datapoints)
    })
  })
}
