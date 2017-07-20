import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getExternalMetrics'
import { Metrics } from 'model/metrics'

describe('getExternalMetrics', () => {
  afterEach(() => {
    Metrics.prototype.listExternal.restore()
  })

  it('should return a list of metrics', async () => {
    const metrics = [{}, {}]
    sinon.stub(Metrics.prototype, 'listExternal').returns(metrics)

    return await handle({filters: '{}'}, null, (error, result) => {
      assert(error === null)
      assert(result.length === metrics.length)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metrics.prototype, 'listExternal').throws()
    return await handle({filters: '{}'}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
