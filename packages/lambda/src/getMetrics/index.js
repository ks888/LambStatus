import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const metrics = await new Metrics().listMetrics(event.type)
    callback(null, JSON.stringify(metrics))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get metrics list')
  }
}
