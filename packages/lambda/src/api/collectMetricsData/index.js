import { Metrics, MetricsData } from 'model/metrics'

export async function handle (event, context, callback) {
  try {
    const metrics = await new Metrics().list()
    await Promise.all(metrics.map(async (metric) => {
      const metricsData = new MetricsData(metric.metricID, metric.type, metric.props, event.StatusPageS3BucketName)
      await metricsData.collect()
    }))
    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to collect metrics data')
  }
}
