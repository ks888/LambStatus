import { Metrics, MetricsData } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const metrics = await new Metrics().listMetrics()
    await Promise.all(metrics.map(async (metric) => {
      const metricsData = new MetricsData(metric.metricID, metric.type, metric.props, event.StatusPageS3BucketName)
      await metricsData.collectData()
    }))
    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to collect metrics data')
  }
}
