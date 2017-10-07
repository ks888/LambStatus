import MetricsStore from 'db/metrics'
import 'plugins/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    let metrics = await new MetricsStore().query()
    metrics = metrics.sort((a, b) => a.order - b.order)
    callback(null, metrics.map(metric => metric.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get metrics list')
  }
}
