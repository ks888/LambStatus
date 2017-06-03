import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMetrics'
import { Metrics, Metric } from 'model/metrics'

describe('getMetrics', () => {
  afterEach(() => {
    Metrics.prototype.list.restore()
  })

  it('should return a list of metrics', async () => {
    const metrics = [
      new Metric('2', undefined, undefined, undefined, undefined, undefined, 2, undefined),
      new Metric('1', undefined, undefined, undefined, undefined, undefined, 1, undefined)
    ]
    sinon.stub(Metrics.prototype, 'list').returns(metrics.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert.deepEqual(result, [metrics[1].objectify(), metrics[0].objectify()])
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metrics.prototype, 'list').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
