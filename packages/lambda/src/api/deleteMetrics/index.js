import MetricsStore from 'db/metrics'
import 'plugins/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    const store = new MetricsStore()
    await store.delete(event.params.metricid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to delete the metric')
  }
}
