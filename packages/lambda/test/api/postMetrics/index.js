import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postMetrics'
import MetricsStore from 'db/metrics'
import { Metric } from 'model/metrics'

describe('postMetrics', () => {
  afterEach(() => {
    MetricsStore.prototype.create.restore()
    Metric.prototype.validateExceptID.restore()
  })

  it('should update the metric', async () => {
    const validteStub = sinon.stub(Metric.prototype, 'validateExceptID').returns()
    const createMetricsStub = sinon.stub(MetricsStore.prototype, 'create').returns()

    await handle({type: 'Mock'}, null, (error, actual) => {
      assert(error === null)
    })
    assert(validteStub.calledOnce)
    assert(createMetricsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metric.prototype, 'validateExceptID').returns()
    sinon.stub(MetricsStore.prototype, 'create').throws()

    return await handle({type: 'Mock'}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
