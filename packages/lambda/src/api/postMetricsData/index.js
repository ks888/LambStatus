import MetricsStore from 'db/metrics'
import 'model/monitoringServices'  // load monitoring services
import { ValidationError } from 'utils/errors'

const maxDatapoints = 3000

const insertDatapoints = async (dataByMetric, resp) => {
  const errors = []
  const numDatapoints = Object.keys(dataByMetric).reduce((sum, id) => { return sum + dataByMetric[id].length }, 0)
  if (numDatapoints > maxDatapoints) {
    errors.push('too many data points')
    return errors
  }

  const ids = Object.keys(dataByMetric)
  for (let i = 0; i < ids.length; i++) {
    const metricID = ids[i]
    const data = dataByMetric[metricID]
    try {
      const store = new MetricsStore()
      const metric = await store.get(metricID)
      if (!metric.monitoringService.shouldAdminPostDatapoints()) {
        throw new ValidationError(`${metric.type} type metrics does not allow a user to submit datapoints`)
      }
      resp[metricID] = await metric.insertDatapoints(data)
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      switch (error.name) {
        case 'NotFoundError':
          errors.push(`the metric ${metricID} not found`)
          break
        case 'ValidationError':
          errors.push(error.message)
          break
        case 'MutexLockedError':
          errors.push(`the metric ${metricID} is locked by others. Try again later.`)
          break
        default:
          errors.push('failed to post the metric')
      }
    }
  }
  return errors
}

export async function handle (event, context, callback) {
  const resp = {}
  const errors = await insertDatapoints(event, resp)
  if (errors.length > 0) {
    const errorResp = errors.map(err => { return {message: `Error: ${err}`} })
    callback(JSON.stringify(errorResp))
    return
  }
  callback(null, resp)
}
