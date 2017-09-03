import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getPublicMetrics'
import { Metrics, Metric } from 'model/metrics'

describe('getPublicMetrics', () => {
  afterEach(() => {
    Metrics.prototype.listPublic.restore()
  })

  it('should return a list of metrics', async () => {
    const metrics = [
      new Metric({metricID: '2', type: 'Mock', order: 2}),
      new Metric({metricID: '1', type: 'Mock', order: 1})
    ]
    sinon.stub(Metrics.prototype, 'listPublic').returns(metrics.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result[0].metricID === metrics[1].metricID)
      assert(result[1].metricID === metrics[0].metricID)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metrics.prototype, 'listPublic').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
