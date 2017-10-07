import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchMetrics'
import MetricsStore from 'db/metrics'
import { Metric } from 'model/metrics'

describe('patchMetrics', () => {
  afterEach(() => {
    MetricsStore.prototype.update.restore()
    Metric.prototype.validate.restore()
  })

  it('should update the metric', async () => {
    const validateStub = sinon.stub(Metric.prototype, 'validate').returns()
    const updateMetricsStub = sinon.stub(MetricsStore.prototype, 'update').returns()

    const expect = '1'
    await handle({ params: { metricid: expect }, body: { type: 'Mock' } }, null, (error, actual) => {
      assert(error === null)
      assert(actual.metricID === expect)
    })
    assert(validateStub.calledOnce)
    assert(updateMetricsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metric.prototype, 'validate').returns()
    sinon.stub(MetricsStore.prototype, 'update').throws()

    return await handle({ params: { metricid: '1' }, body: { type: 'Mock' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
