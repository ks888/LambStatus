import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMetrics'
import MetricsStore from 'db/metrics'
import { Metric } from 'model/metrics'

describe('getMetrics', () => {
  afterEach(() => {
    MetricsStore.prototype.query.restore()
  })

  it('should return a list of metrics', async () => {
    const metrics = [
      new Metric({metricID: '2', type: 'Mock', order: 2}),
      new Metric({metricID: '1', type: 'Mock', order: 1})
    ]
    sinon.stub(MetricsStore.prototype, 'query').returns(metrics.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result.length === metrics.length)
      assert(result[0].metricID === metrics[1].metricID)
      assert(result[1].metricID === metrics[0].metricID)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MetricsStore.prototype, 'query').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
