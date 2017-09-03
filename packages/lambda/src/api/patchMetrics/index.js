import { Metric } from 'model/metrics'
import 'model/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    const params = Object.assign({}, {metricID: event.params.metricid}, event.body)
    const metric = new Metric(params)
    await metric.validate()
    await metric.save()
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
        callback('Error: failed to update a component')
    }
  }
}
