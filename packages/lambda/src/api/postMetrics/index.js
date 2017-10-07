import MetricsStore from 'db/metrics'
import { Metric } from 'model/metrics'
import 'plugins/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    const metric = new Metric(event)
    await metric.validateExceptID()
    const store = new MetricsStore()
    await store.create(metric)

    callback(null, metric.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to post the metric')
    }
  }
}
