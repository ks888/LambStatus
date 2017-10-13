import 'plugins/monitoringServices'  // load monitoring services
import { monitoringServiceManager } from 'model/monitoringService'

export async function handle (event, context, callback) {
  try {
    const monitoringService = monitoringServiceManager.create(event.type)
    let externalMetrics = await monitoringService.listMetrics(event.cursor, JSON.parse(event.filters))
    externalMetrics.metrics = externalMetrics.metrics.filter((metric) => {
      return metric.Dimensions.reduce((prev, dim) => {
        return prev || dim.Value.includes('demo') || dim.Value.includes('Demo')
      }, false)
    })

    callback(null, externalMetrics)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get external metrics list')
  }
}
