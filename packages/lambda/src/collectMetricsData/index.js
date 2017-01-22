import MetricsService from 'service/metrics'
import { getMetricData } from 'utils/cloudWatch'

export async function handler (event, context, callback) {
  const service = new MetricsService()
  try {
    const metrics = await service.listMetrics()
    await Promise.all(metrics.map(async (metric) => {
      const datapoints = await getMetricData(metric.props)
      await service.saveMetricData(metric.metricID, datapoints)
    }))
    callback(null)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to collect metrics data')
  }
}
