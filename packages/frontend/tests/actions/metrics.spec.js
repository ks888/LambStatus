import fetchMock from 'fetch-mock'
import {
  LIST_METRICS,
  LIST_EXTERNAL_METRICS,
  LIST_METRICS_DATA,
  ADD_METRIC,
  EDIT_METRIC,
  REMOVE_METRIC,
  fetchMetrics,
  fetchPublicMetrics,
  fetchExternalMetrics,
  fetchMetricsData,
  postMetric,
  updateMetric,
  deleteMetric
} from 'actions/metrics'

describe('Actions/Metrics', () => {
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
  let dispatchSpy, callbacks

  beforeEach(() => {
    dispatchSpy = sinon.spy(() => {})
    callbacks = {
      onLoad: sinon.spy(),
      onSuccess: sinon.spy(),
      onFailure: sinon.spy()
    }
  })

  afterEach(() => {
    fetchMock.restore()
  })

  describe('fetchMetrics', () => {
    it('should return a function.', () => {
      assert(typeof fetchMetrics() === 'function')
    })

    it('should fetch metrics.', () => {
      fetchMock.get(/.*\/metrics/, { body: metrics, headers: {'Content-Type': 'application/json'} })

      return fetchMetrics(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.firstCall.args[0].type === LIST_METRICS)
          assert.deepEqual(metrics, dispatchSpy.firstCall.args[0].metrics)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.get(/.*\/metrics/, { status: 400, body: {} })

      return fetchMetrics(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.notCalled)
          assert(callbacks.onFailure.calledOnce)

          assert(dispatchSpy.notCalled)
        })
    })
  })

  describe('fetchPublicMetrics', () => {
    it('should return a function.', () => {
      assert(typeof fetchPublicMetrics() === 'function')
    })

    it('should fetch public metrics.', () => {
      fetchMock.get(/.*\/public-metrics/, { body: metrics, headers: {'Content-Type': 'application/json'} })

      return fetchPublicMetrics(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.firstCall.args[0].type === LIST_METRICS)
          assert.deepEqual(metrics, dispatchSpy.firstCall.args[0].metrics)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.get(/.*\/public-metrics/, { status: 400, body: {} })

      return fetchPublicMetrics(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.notCalled)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('fetchExternalMetrics', () => {
    it('should return a function.', () => {
      assert(typeof fetchExternalMetrics() === 'function')
    })

    it('should fetch external metrics.', () => {
      fetchMock.get(/.*\/external-metrics/, { body: externalMetrics, headers: {'Content-Type': 'application/json'} })

      const metricsType = 'type'
      const filters = {}
      return fetchExternalMetrics(metricsType, filters, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.firstCall.args[0].type === LIST_EXTERNAL_METRICS)
          assert.deepEqual(filters, dispatchSpy.firstCall.args[0].filters)
          assert.deepEqual(externalMetrics.metrics, dispatchSpy.firstCall.args[0].metrics)
        })
    })

    it('should properly encode query parameters.', () => {
      fetchMock.get(/.*\/external-metrics/, { body: externalMetrics, headers: {'Content-Type': 'application/json'} })

      const metricsType = '&!='
      const filters = {a: '1'}
      return fetchExternalMetrics(metricsType, filters, callbacks)(dispatchSpy)
        .then(() => {
          const lastURL = fetchMock.lastUrl(/.*\/external-metrics/)
          assert(lastURL.match(/type=%26!%3D/))
          assert(lastURL.match(/filters=%7B%22a%22%3A%221%22%7D/))
        })
    })

    it('should repeatedly fetch external metrics until there is no nextCursor.', () => {
      const metricsWithCursor = {
        ...externalMetrics,
        nextCursor: 1
      }
      fetchMock.get(/.*\/external-metrics.*cursor.*/,
                    { body: externalMetrics, headers: {'Content-Type': 'application/json'} })
      fetchMock.get(/.*\/external-metrics/,
                    { body: metricsWithCursor, headers: {'Content-Type': 'application/json'} })

      return fetchExternalMetrics('type', {}, callbacks)(dispatchSpy)
        .then(() => {
          assert(fetchMock.calls(/.*\/external-metrics.*cursor.*/).length === 1)
          assert(fetchMock.calls(/.*\/external-metrics/).length === 1)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.get(/.*\/external-metrics.*/, { status: 400, body: {} })

      return fetchExternalMetrics('', {}, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.notCalled)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('postMetric', () => {
    it('should return a function.', () => {
      assert(typeof postMetric() === 'function')
    })

    it('should post a new metric.', () => {
      fetchMock.post(/.*\/metrics/, { body: metrics[0], headers: {'Content-Type': 'application/json'} })

      return postMetric('', '', '', '', '', '', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.firstCall.args[0].type === ADD_METRIC)
          assert.deepEqual(metrics[0], dispatchSpy.firstCall.args[0].metric)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.post(/.*\/metrics/, { status: 400, body: {} })

      return postMetric('', '', '', '', '', '', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.notCalled)
          assert(callbacks.onFailure.calledOnce)

          assert(dispatchSpy.notCalled)
        })
    })
  })

  describe('updateMetric', () => {
    it('should return a function.', () => {
      assert(typeof updateMetric() === 'function')
    })

    it('should update the existing metric.', () => {
      fetchMock.patch(/.*\/metrics\/.*/, { body: metrics[0], headers: {'Content-Type': 'application/json'} })

      return updateMetric('', '', '', '', '', '', '', '', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.firstCall.args[0].type === EDIT_METRIC)
          assert.deepEqual(metrics[0], dispatchSpy.firstCall.args[0].metric)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.patch(/.*\/metrics\/.*/, { status: 400, body: {} })

      return updateMetric('', '', '', '', '', '', '', '', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('deleteMetric', () => {
    it('should return a function.', () => {
      assert(typeof deleteMetric() === 'function')
    })

    it('should delete the metric.', () => {
      fetchMock.delete(/.*\/metrics\/.*/, 204)

      const id = 'id'
      return deleteMetric(id, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === REMOVE_METRIC)
          assert.deepEqual(id, dispatchSpy.firstCall.args[0].metricID)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.delete(/.*\/metrics\/.*/, { status: 400, body: {} })

      return deleteMetric('', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.notCalled)
          assert(callbacks.onFailure.calledOnce)

          assert(dispatchSpy.notCalled)
        })
    })
  })

  describe('fetchMetricsData', () => {
    it('should return a function.', () => {
      assert(typeof fetchMetricsData('') === 'function')
    })

    it('should fetch metrics.', () => {
      fetchMock.get(/.*\/metrics\/.*/, { body: metricsData, headers: {'Content-Type': 'application/json'} })

      const id = 'id'
      const year = '2017'
      const month = '06'
      const date = '28'
      return fetchMetricsData('', id, year, month, date, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.firstCall.args[0].type === LIST_METRICS_DATA)
          assert(id === dispatchSpy.firstCall.args[0].metricID)
          assert(year === dispatchSpy.firstCall.args[0].year)
          assert(month === dispatchSpy.firstCall.args[0].month)
          assert(date === dispatchSpy.firstCall.args[0].date)
          assert.deepEqual(metricsData, dispatchSpy.firstCall.args[0].metricsData)
        })
    })

    it('should not call dispatch if the data is not found.', () => {
      fetchMock.get(/.*\/metrics\/.*/, { body: '<html />', headers: {'Content-Type': 'text/html'} })

      return fetchMetricsData('', '', '', '', '', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(callbacks.onFailure.notCalled)

          assert(dispatchSpy.notCalled)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.get(/.*\/metrics\/.*/, { status: 400, body: {} })

      return fetchMetricsData('', '', '', '', '', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.notCalled)
          assert(callbacks.onFailure.calledOnce)

          assert(dispatchSpy.notCalled)
        })
    })
  })
})
