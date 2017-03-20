import { Metrics } from 'model/metrics'

export async function handle (event, context, callback) {
  try {
    const externalMetrics = await new Metrics().listExternal(event.type)
    callback(null, JSON.stringify(externalMetrics))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get external metrics list')
  }
}
