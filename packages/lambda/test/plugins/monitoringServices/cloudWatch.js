import assert from 'assert'
import sinon from 'sinon'
import CloudWatchAPI from 'aws/cloudWatch'
import CloudWatch from 'plugins/monitoringServices/cloudWatch'

describe('CloudWatch', () => {
  it('should return a list of metrics', async () => {
    const expect = [1, 2]
    const stub = sinon.stub(CloudWatchAPI.prototype, 'listMetrics').returns(expect)
    const cloudWatch = new CloudWatch()

    const actual = await cloudWatch.listMetrics()
    assert(stub.calledOnce)
    assert.deepEqual(actual, expect)

    CloudWatchAPI.prototype.listMetrics.restore()
  })

  it('should get metric data', async () => {
    const expect = [1, 2]
    const stub = sinon.stub(CloudWatchAPI.prototype, 'getMetricData').returns(expect)
    const cloudWatch = new CloudWatch()

    const actual = await cloudWatch.getMetricData()
    assert(stub.calledOnce)
    assert.deepEqual(actual, expect)

    CloudWatchAPI.prototype.getMetricData.restore()
  })
})
