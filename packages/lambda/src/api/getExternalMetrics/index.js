import 'model/monitoringServices'  // load monitoring services
import { monitoringServiceManager } from 'model/monitoringService'

export async function handle (event, context, callback) {
  try {
    const monitoringService = monitoringServiceManager.create(event.type)
    const externalMetrics = await monitoringService.listMetrics(event.cursor, JSON.parse(event.filters))

    callback(null, externalMetrics)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get external metrics list')
  }
}
