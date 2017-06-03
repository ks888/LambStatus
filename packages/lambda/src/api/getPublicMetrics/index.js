import { Metrics } from 'model/metrics'

export async function handle (event, context, callback) {
  try {
    let metrics = await new Metrics().listPublic()
    metrics = metrics.sort((a, b) => a.order - b.order)
    callback(null, metrics.map(metric => metric.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get metrics list')
  }
}
