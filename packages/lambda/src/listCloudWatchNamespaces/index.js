import MetricsService from 'service/cloudWatchMetrics'

export async function handler (event, context, callback) {
  const service = new MetricsService()
  try {
    const metrics = await service.listMetrics()
    const namespaces = new Set()
    metrics.forEach((metric) => {
      namespaces.add(metric.Namespace)
    })
    callback(null, JSON.stringify(namespaces))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get namespace list')
  }
}
