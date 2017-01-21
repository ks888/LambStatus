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
