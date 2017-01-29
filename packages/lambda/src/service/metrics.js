import Metrics from 'db/metrics'
import MetricsData from 'db/metricsData'
import generateID from 'utils/generateID'
import { ParameterError } from 'utils/errors'
import { monitoringServices } from 'utils/const'

export default class MetricsService {
  constructor () {
    this.metrics = new Metrics()
    this.metricsData = new MetricsData()
  }

  async listMetrics () {
    return await this.metrics.listMetrics()
  }

  validate (metricID, type, namespace, metricName, dimensions) {
    if (metricID === undefined || metricID === '') {
      throw new ParameterError('invalid metricID parameter')
    }

    if (monitoringServices.indexOf(type) < 0) {
      throw new ParameterError('invalid type parameter')
    }

    if (namespace === undefined || namespace === '') {
      throw new ParameterError('invalid namespace parameter')
    }

    if (metricName === undefined || metricName === '') {
      throw new ParameterError('invalid metricName parameter')
    }

    if (dimensions === undefined || !Array.isArray(dimensions)) {
      throw new ParameterError('invalid dimensions parameter')
    }
  }

  async registerMetric (type, namespace, metricName, dimensions) {
    const metricID = generateID()
    this.validate(metricID, type, namespace, metricName, dimensions)

    const props = {
      Namespace: namespace,
      MetricName: metricName,
      Dimensions: dimensions
    }
    return await this.metrics.postMetric(metricID, type, props)
  }
}
