import { Metric } from 'model/metrics'

export async function handle (event, context, callback) {
  try {
    const metric = new Metric(event.params.metricid, event.body.type, event.body.title, event.body.unit,
                              event.body.description, event.body.status, event.body.order, event.body.props)
    await metric.validate()
    await metric.save()
    callback(null, JSON.stringify(metric.objectify()))
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
