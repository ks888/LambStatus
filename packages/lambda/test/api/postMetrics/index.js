import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postMetrics'
import { Metric } from 'model/metrics'

describe('postMetrics', () => {
  afterEach(() => {
    Metric.prototype.validate.restore()
    Metric.prototype.save.restore()
  })

  it('should update the metric', async () => {
    const validateStub = sinon.stub(Metric.prototype, 'validate').returns()
    const saveStub = sinon.stub(Metric.prototype, 'save').returns()

    await handle({type: 'Mock'}, null, (error, actual) => {
      assert(error === null)
      assert(actual.metricID.length === 12)
    })
    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metric.prototype, 'validate').throws()
    sinon.stub(Metric.prototype, 'save').returns()

    return await handle({type: 'Mock'}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
