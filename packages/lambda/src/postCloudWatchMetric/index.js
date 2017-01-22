import MetricsService from 'service/metrics'

export async function handler (event, context, callback) {
  const service = new MetricsService()
  try {
    const metric = await service.registerMetric('CloudWatch', event.namespace, event.metricName, event.dimensions)
    callback(null, JSON.stringify(metric))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to post the metric')
  }
}
