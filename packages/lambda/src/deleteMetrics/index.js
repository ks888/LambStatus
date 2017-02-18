import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    await new Metrics().deleteMetric(event.params.metricid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ParameterError':
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
