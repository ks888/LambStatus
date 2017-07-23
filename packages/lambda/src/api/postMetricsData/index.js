import { Metrics } from 'model/metrics'
import 'model/monitoringServices'  // load monitoring services
import { ValidationError } from 'utils/errors'

export async function handle (event, context, callback) {
  const metrics = new Metrics()
  const resp = {}
  const errorResp = []
  const keys = Object.keys(event)
  for (let i = 0; i < keys.length; i++) {
    const metricID = keys[i]
    const data = event[metricID]
    try {
      const metric = await metrics.lookup(metricID)
      if (!metric.monitoringService.shouldAdminPostDatapoints()) {
        throw new ValidationError(`${metric.type} type metrics does not allow a user to submit datapoints`)
      }
      resp[metricID] = await metric.insertDatapoints(data)
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      switch (error.name) {
        case 'NotFoundError':
          errorResp.push({message: `Error: the metric ${metricID} not found`})
          break
        case 'ValidationError':
          errorResp.push({message: `Error: ${error.message}`})
          break
        default:
          errorResp.push({message: 'Error: failed to post the metric'})
      }
    }
  }

  if (errorResp.length > 0) {
    callback(errorResp)
    return
  }
  callback(null, resp)
}
