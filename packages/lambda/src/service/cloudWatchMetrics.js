import { postMetric } from 'db/cloudWatchMetrics'
import { listMetrics } from 'utils/cloudWatch'
import generateID from 'utils/generateID'
import { ParameterError } from 'utils/errors'

export default class CloudWatchMetricsService {
  async listMetrics (namespace) {
    return await listMetrics(namespace)
  }

  validate (metricID, namespace, metricName, dimensions) {
    if (metricID === undefined || metricID === '') {
      throw new ParameterError('invalid metricID parameter')
    }

    if (namespace === undefined || namespace === '') {
      throw new ParameterError('invalid namespace parameter')
    }

    if (metricName === undefined || metricName === '') {
      throw new ParameterError('invalid metricName parameter')
    }

    if (dimensions === undefined) {
      throw new ParameterError('invalid dimensions parameter')
    }
  }

  async postMetric (namespace, metricName, dimensions) {
    const metricID = generateID()
    this.validate(metricID, namespace, metricName, dimensions)

    return await postMetric(metricID, namespace, metricName, dimensions)
  }
}
