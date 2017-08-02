import { Metrics } from 'model/metrics'
import 'model/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    const externalMetrics = await new Metrics().listExternal(event.type, event.cursor, JSON.parse(event.filters))
    callback(null, externalMetrics)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get external metrics list')
  }
}
