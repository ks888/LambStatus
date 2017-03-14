import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const metric = await new Metrics().createMetric(event.type, event.title, event.unit,
                                                      event.description, event.status, event.props)
    callback(null, JSON.stringify(metric))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ParameterError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to post the metric')
    }
  }
}
