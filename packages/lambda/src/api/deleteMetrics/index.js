import { Metrics } from 'model/metrics'

export async function handle (event, context, callback) {
  try {
    const metrics = new Metrics()
    const metric = await metrics.lookup(event.params.metricid)
    await metric.delete()
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
        callback('Error: failed to delete a component')
    }
  }
}
