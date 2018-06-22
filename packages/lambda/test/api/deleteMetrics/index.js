import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/deleteMetrics'
import MetricsStore from 'db/metrics'

describe('deleteMetrics', () => {
  let deleteMetricStub

  beforeEach(() => {
    deleteMetricStub = sinon.stub(MetricsStore.prototype, 'delete')
  })

  afterEach(() => {
    MetricsStore.prototype.delete.restore()
  })

  it('should delete the metric', async () => {
    let err
    await handle({ params: { metricid: '1' } }, null, error => {
      err = error
    })
    assert(err === undefined)
    assert(deleteMetricStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    deleteMetricStub.throws()

    let err
    await handle({params: {metricid: '1'}}, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
