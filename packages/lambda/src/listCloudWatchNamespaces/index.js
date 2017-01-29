import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const metrics = await new Metrics().listMetrics('CloudWatch')
    const namespaces = new Set()
    metrics.forEach((metric) => {
      namespaces.add(metric.Namespace)
    })
    callback(null, JSON.stringify(namespaces))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get namespace list')
  }
}
