import { listMetrics } from 'utils/cloudWatch'

export async function handler (event, context, callback) {
  try {
    const metrics = await listMetrics(event.namespace)
    callback(null, JSON.stringify(metrics))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get metrics list')
  }
}
