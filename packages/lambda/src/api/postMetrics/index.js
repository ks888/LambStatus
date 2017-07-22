import { Metric } from 'model/metrics'
import 'model/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    const metric = new Metric(undefined, event.type, event.title, event.unit,
                              event.description, event.status, event.order, event.props)
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
        callback('Error: failed to post the metric')
    }
  }
}
