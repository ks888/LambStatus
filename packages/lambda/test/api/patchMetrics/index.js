import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchMetrics'
import { Metric } from 'model/metrics'

describe('patchMetrics', () => {
  afterEach(() => {
    Metric.prototype.validate.restore()
    Metric.prototype.save.restore()
  })

  it('should update the metric', async () => {
    const validateStub = sinon.stub(Metric.prototype, 'validate').returns()
    const saveStub = sinon.stub(Metric.prototype, 'save').returns()

    const expect = '1'
    await handle({ params: { metricid: expect }, body: { type: 'Mock' } }, null, (error, actual) => {
      assert(error === null)
      assert(actual.metricID === expect)
    })
    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metric.prototype, 'validate').throws()
    sinon.stub(Metric.prototype, 'save').returns()

    return await handle({ params: { metricid: '1' }, body: { type: 'Mock' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
