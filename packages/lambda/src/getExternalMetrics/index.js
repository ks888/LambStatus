import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const externalMetrics = await new Metrics().listExternalMetrics(event.type)
    callback(null, JSON.stringify(externalMetrics))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get external metrics list')
  }
}
