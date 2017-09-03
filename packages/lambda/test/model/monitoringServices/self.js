import assert from 'assert'
import sinon from 'sinon'
import { Metrics, Metric } from 'model/metrics'
import Self from 'model/monitoringServices/self'
import { NotFoundError } from 'utils/errors'

describe('Self', () => {
  describe('listMetrics', () => {
    it('should return a list of self-type metrics', async () => {
      const expect = [
        new Metric({metricID: '1', type: 'Self'}),
        new Metric({metricID: '2', type: 'Self'})
      ]
      const stub = sinon.stub(Metrics.prototype, 'list').returns(expect)

      const actual = await new Self().listMetrics()
      assert(stub.calledOnce)
      assert(actual.length === expect.length)
      assert(actual[0].metricID === expect[0].metricID)
      assert(actual[1].metricID === expect[1].metricID)

      Metrics.prototype.list.restore()
    })

    it('should remove non-self-type metrics', async () => {
      const expect = [
        new Metric({metricID: '1', type: 'Self'}),
        new Metric({metricID: '2', type: 'Self'})
      ]
      expect[1].type = 'Unknown'
      const stub = sinon.stub(Metrics.prototype, 'list').returns(expect)

      const actual = await new Self().listMetrics()
      assert(stub.calledOnce)
      assert(actual.length === 1)
      assert(actual[0].metricID === expect[0].metricID)

      Metrics.prototype.list.restore()
    })
  })

  describe('getMetricData', () => {
    afterEach(() => {
      Metrics.prototype.lookup.restore()
      Metric.prototype.getDatapoints.restore()
    })

    it('should return metric data between start time and end time', async () => {
      const start = new Date()
      const end = new Date(start.getTime() + 1)
      sinon.stub(Metrics.prototype, 'lookup').returns(new Metric({metricID: '1', type: 'Self'}))
      const expect = [{value: 1, timestamp: start.toISOString()}, {value: 2, timestamp: end.toISOString()}]
      const stub = sinon.stub(Metric.prototype, 'getDatapoints').returns(expect)

      const actual = await new Self().getMetricData(1, {}, start, end)
      assert(actual.length === 1)
      assert(actual[0].value === expect[0].value)
      assert(stub.calledOnce)
    })

    it('should return metric data between start time and end time', async () => {
      const start = new Date()
      const startPlusOneDay = new Date(start.getTime() + 24 * 60 * 60 * 1000 /* 1 day */)
      const numDates = 3
      const end = new Date(start.getTime() + numDates * 24 * 60 * 60 * 1000)
      sinon.stub(Metrics.prototype, 'lookup').returns(new Metric({metricID: '1', type: 'Self'}))

      const expect = [
        {value: 1, timestamp: start.toISOString()},
        {value: 2, timestamp: startPlusOneDay.toISOString()}
      ]
      const stub = sinon.stub(Metric.prototype, 'getDatapoints')
      stub.withArgs(start).returns(expect.slice(0, 1))
      stub.withArgs(startPlusOneDay).returns(expect.slice(1))
      stub.returns(null)

      const actual = await new Self().getMetricData(1, {}, start, end)
      assert(actual.length === 2)
      assert(actual[0].value === expect[0].value)
      assert(actual[1].value === expect[1].value)
      assert(stub.callCount === numDates + 1)
    })

    it('should throw an error if the start time is later than end time', async () => {
      const start = new Date()
      const end = new Date(start.getTime() - 24 * 60 * 60 * 1000)
      sinon.stub(Metrics.prototype, 'lookup').returns(new Metric({metricID: '1', type: 'Self'}))
      sinon.stub(Metric.prototype, 'getDatapoints').returns(null)

      try {
        await new Self().getMetricData(1, {}, start, end)
        assert(false)
      } catch (err) {
        assert(err.message.match(/later/))
      }
    })

    it('should throw an error if metric ID does not exist', async () => {
      const start = new Date()
      const end = new Date(start.getTime() + 1)
      sinon.stub(Metrics.prototype, 'lookup').throws(new NotFoundError('no matched item'))
      sinon.stub(Metric.prototype, 'getDatapoints').returns(null)

      try {
        await new Self().getMetricData(1, {}, start, end)
        assert(false)
      } catch (err) {
        assert(err.message.match(/match/))
      }
    })
  })
})
