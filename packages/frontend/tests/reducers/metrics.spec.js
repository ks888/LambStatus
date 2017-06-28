import { listMetrics, listExternalMetrics, listMetricsData, addMetric, editMetric,
         removeMetric } from 'actions/metrics'
import metricsReducer from 'reducers/metrics'

describe('Reducers/metrics', () => {
  const metrics = [{
    metricID: '1',
    type: 'CloudWatch',
    title: 'metric',
    unit: '',
    description: '',
    status: 'Hidden',
    order: 1,
    props: {}
  }]
  const externalMetrics = {
    metrics: [{ MetricName: 'Response Time' }]
  }
  const metricsData = [
    {timestamp: '2017-06-27T01:03:00.000Z', value: 0},
    {timestamp: '2017-06-27T01:14:00.000Z', value: 0}
  ]

  describe('listMetricsHandler', () => {
    it('should update the metrics.', () => {
      const state = metricsReducer(undefined, listMetrics(metrics))
      assert.deepEqual(metrics, state.metrics)
    })

    it('should not remove existing data.', () => {
      const metricsWithData = [{...metrics[0], data: metricsData}]
      const state = metricsReducer({metrics: metricsWithData}, listMetrics(metrics))
      assert.deepEqual(state.metrics[0].data, metricsData)
    })
  })

  describe('listExternalMetricsHandler', () => {
    it('should update the metrics.', () => {
      const type = 'type'
      const filters = {}
      const state = metricsReducer(undefined, listExternalMetrics(type, filters, externalMetrics))
      assert(state.externalMetrics[type] !== undefined)
      assert(state.externalMetrics[type].filters === filters)
      assert.deepEqual(state.externalMetrics[type].metrics, externalMetrics)
    })
  })

  describe('addMetricHandler', () => {
    it('should add the new metric to the store.', () => {
      const state = metricsReducer({metrics}, addMetric({...metrics[0], metricID: '2'}))

      assert(state.metrics.length === 2)
      assert(state.metrics[0].metricID === '1')
      assert(state.metrics[1].metricID === '2')
    })
  })

  describe('editMetricHandler', () => {
    it('should update the existing metric.', () => {
      const newTitle = 'newtitle'
      const state = metricsReducer({metrics}, editMetric({...metrics[0], title: newTitle}))

      assert(state.metrics.length === 1)
      assert(state.metrics[0].title === newTitle)
    })

    it('should sort the metrics using latest orders.', () => {
      const existingMetrics = [...metrics, {...metrics[0], metricID: '2'}]
      const state = metricsReducer({metrics: existingMetrics}, editMetric({...metrics[0], order: 2}))

      assert(state.metrics.length === 2)
      assert(state.metrics[0].metricID === '2')
    })
  })

  describe('removeMetricHandler', () => {
    it('should delete the metric.', () => {
      const state = metricsReducer({metrics}, removeMetric('1'))
      assert(state.metrics.length === 0)
    })
  })

  describe('listMetricsDataHandler', () => {
    it('should update the metrics.', () => {
      const state = metricsReducer(undefined, listMetrics(metrics))
      assert.deepEqual(metrics, state.metrics)
    })

    it('should not remove existing data.', () => {
      const metricsWithData = [{...metrics[0], data: metricsData}]
      const state = metricsReducer({metrics: metricsWithData}, listMetrics(metrics))
      assert.deepEqual(state.metrics[0].data, metricsData)
    })
  })
})
