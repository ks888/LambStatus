import MetricsService from 'service/cloudWatchMetrics'

export async function handler (event, context, callback) {
  const service = new MetricsService()
  try {
    const metrics = await service.listMetrics(event.namespace)
    callback(null, JSON.stringify(metrics))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get metrics list')
  }
}
