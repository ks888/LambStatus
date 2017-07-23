import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/collectMetricsData'
import { Metrics, Metric } from 'model/metrics'

describe('collectMetricsData', () => {
  let shouldAdminPostDatapointsMock
  beforeEach(() => {
    shouldAdminPostDatapointsMock = sinon.stub(MockService.prototype, 'shouldAdminPostDatapoints').returns(false)
  })

  afterEach(() => {
    Metrics.prototype.list.restore()
    Metric.prototype.collect.restore()
    MockService.prototype.shouldAdminPostDatapoints.restore()
  })

  it('should collect the new data for each metric', async () => {
    const metrics = [new Metric('1', 'Mock'), new Metric('2', 'Mock')]
    sinon.stub(Metrics.prototype, 'list').returns(metrics)
    const stub = sinon.stub(Metric.prototype, 'collect').returns()

    await handle({}, null, (error, result) => {
      assert(error === null)
      assert(stub.callCount === metrics.length)
    })
  })

  it('should resolve all promises', async () => {
    const metrics = [new Metric('1', 'Mock'), new Metric('2', 'Mock')]
    sinon.stub(Metrics.prototype, 'list').returns(metrics)
    let numResolved = 0
    const stub = sinon.stub(Metric.prototype, 'collect')
    stub.onFirstCall().returns(new Promise(resolve => {
      numResolved++
      resolve()
    })).onSecondCall().returns(new Promise(resolve => {
      numResolved++
      resolve()
    }))

    await handle({}, null, (error, result) => {
      assert(error === null)
      assert(stub.callCount === metrics.length)
      assert(numResolved === metrics.length)
    })
  })

  it('should not collect the new data if the admin should post datapoints ', async () => {
    shouldAdminPostDatapointsMock.returns(true)
    sinon.stub(Metrics.prototype, 'list').returns([new Metric('1', 'Mock')])
    const stub = sinon.stub(Metric.prototype, 'collect').returns()

    await handle({}, null, (error, result) => {
      assert(error === null)
      assert(stub.notCalled)
    })
  })

  it('should return error if the promise is rejected', async () => {
    const metrics = [new Metric('1', 'Mock'), new Metric('2', 'Mock')]
    sinon.stub(Metrics.prototype, 'list').returns(metrics)
    sinon.stub(Metric.prototype, 'collect').returns(new Promise((resolve, reject) => {
      reject(new Error())
    }))

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Metrics.prototype, 'list').throws()
    sinon.stub(Metric.prototype, 'collect').throws()

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
