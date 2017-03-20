import { Metrics } from 'model/metrics'

export async function handle (event, context, callback) {
  try {
    const metrics = await new Metrics().list()
    callback(null, JSON.stringify(metrics.map(metric => metric.objectify())))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get metrics list')
  }
}
