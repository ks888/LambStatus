import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const metric = await new Metrics().registerMetric(event.type, event.props)
    callback(null, JSON.stringify(metric))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to post the metric')
  }
}
