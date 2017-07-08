import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postMetricsData'
import { Metrics, Metric } from 'model/metrics'
import { NotFoundError } from 'utils/errors'

describe('postMetricsData', () => {
  afterEach(() => {
    Metrics.prototype.lookup.restore()
    Metric.prototype.insertDatapoints.restore()
  })

  it('should post data and return inserted data', async () => {
    const datapoints = {
      1: [{timestamp: '2017-07-03T00:00:00.000Z', value: 1}]
    }
    const stub = sinon.stub(Metric.prototype, 'insertDatapoints').returns(datapoints[1])
    sinon.stub(Metrics.prototype, 'lookup').returns(new Metric())

    await handle(datapoints, null, (error, result) => {
      assert(error === null)
      assert(result.length === datapoints.length)
      assert.deepEqual(result[1], datapoints[1])
    })
    assert(stub.calledOnce)
  })

  it('should post multiple data and return inserted data', async () => {
    const datapoints = {
      1: [{timestamp: '2017-07-03T00:00:00.000Z', value: 1}],
      2: [{timestamp: '2017-07-03T01:00:00.000Z', value: 2}]
    }
    const stub = sinon.stub(Metric.prototype, 'insertDatapoints')
    stub.onCall(0).returns(datapoints[1])
    stub.onCall(1).returns(datapoints[2])
    sinon.stub(Metrics.prototype, 'lookup').returns(new Metric())

    await handle(datapoints, null, (error, result) => {
      assert(error === null)
      assert(result.length === datapoints.length)
      assert.deepEqual(result[1], datapoints[1])
      assert.deepEqual(result[2], datapoints[2])
    })
    assert(stub.calledTwice)
  })

  it('should return not found error if metric ID does not exist', async () => {
    sinon.stub(Metric.prototype, 'insertDatapoints').returns()
    sinon.stub(Metrics.prototype, 'lookup').throws(new NotFoundError('no matched item'))

    const id = 123
    return await handle({[id]: []}, null, (error, result) => {
      assert(error.length === 1)
      assert(error[0].message.match(new RegExp(id)))
    })
  })

  it('should return a list of errors if there are several errors', async () => {
    sinon.stub(Metric.prototype, 'insertDatapoints').returns()
    const stub = sinon.stub(Metrics.prototype, 'lookup')
    stub.onCall(0).throws(new NotFoundError('no matched item'))
    stub.onCall(1).throws(new Error())

    const id1 = 123
    const id2 = 456
    return await handle({[id1]: [], [id2]: []}, null, (error, result) => {
      assert(error.length === 2)
      assert(error[0].message.match(new RegExp(id1)))
      assert(error[1].message.match(new RegExp(id2)) === null)
    })
  })
})
