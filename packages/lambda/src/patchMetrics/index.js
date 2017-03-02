import { Metrics } from 'metrics'

export async function handler (event, context, callback) {
  try {
    const metric = await new Metrics().updateMetric(event.params.metricid, event.body.type, event.body.title,
                                                    event.body.unit, event.body.description, event.body.status,
                                                    event.body.props)
    callback(null, JSON.stringify(metric))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ParameterError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to update a component')
    }
  }
}
