import { MetricsStoreProxy } from 'api/utils'
import 'plugins/monitoringServices'  // load monitoring services

export async function handle (event, context, callback) {
  try {
    let metrics = await new MetricsStoreProxy().query()
    await Promise.all(metrics
                      .filter(metric => !metric.monitoringService.shouldAdminPostDatapoints())
                      .map(async metric => await metric.collect()))
    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to collect metrics data')
  }
}
