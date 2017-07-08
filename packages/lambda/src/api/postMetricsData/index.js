import { Metrics } from 'model/metrics'

export async function handle (event, context, callback) {
  const metrics = new Metrics()
  try {
    const resp = {}
    await Promise.all(Object.keys(event).map(async metricID => {
      const data = event[metricID]
      const metric = await metrics.lookup(metricID)
      resp[metricID] = await metric.insertDatapoints(data)
    }))
    callback(null, resp)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to post the metric')
    }
  }
}
