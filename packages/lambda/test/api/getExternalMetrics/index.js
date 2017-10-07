import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getExternalMetrics'

describe('getExternalMetrics', () => {
  afterEach(() => {
    MockService.prototype.listMetrics.restore()
  })

  it('should return a list of metrics', async () => {
    const metrics = [{metricID: 1}, {metricID: 2}]
    sinon.stub(MockService.prototype, 'listMetrics').returns(metrics)

    return await handle({type: 'Mock', filters: '{}'}, null, (error, result) => {
      assert(error === null)
      assert(result.length === metrics.length)
      assert(result[0].metricID === 1)
      assert(result[1].metricID === 2)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MockService.prototype, 'listMetrics').throws()

    return await handle({type: 'Mock', filters: '{}'}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
