import assert from 'assert'
import sinon from 'sinon'
import _AWS from 'aws-sdk'
import AWS from 'aws-sdk-mock'
import CloudWatch from 'aws/cloudWatch'

describe('CloudWatch', () => {
  afterEach(() => {
    AWS.restore('CloudWatch')
  })

  describe('listMetrics', () => {
    it('should return a list of external metrics', async () => {
      const expect = {Metrics: [], NextToken: ''}
      AWS.mock('CloudWatch', 'listMetrics', (params, callback) => {
        callback(null, expect)
      })

      const cloudWatch = new CloudWatch()
      const actual = await cloudWatch.listMetrics()

      assert(actual.metrics.length === expect.Metrics.length)
      assert(actual.nextCursor === expect.NextToken)
    })

    it('should set next token if it is given as a param', async () => {
      const token = 'token'
      AWS.mock('CloudWatch', 'listMetrics', (params, callback) => {
        assert(params.NextToken === token)
        callback(null, {})
      })

      const cloudWatch = new CloudWatch()
      await cloudWatch.listMetrics(token)
    })

    it('should set region if it is given as a param', async () => {
      let actual
      let constructor = _AWS.CloudWatch
      // save the args given to the constructor
      sinon.stub(_AWS, 'CloudWatch', (args) => {
        actual = args
        const inst = new constructor(args)
        sinon.stub(inst, 'listMetrics', (params, callback) => {
          callback(null, {})
        })
        return inst
      })

      const cloudWatch = new CloudWatch()
      const expect = 'region'
      await cloudWatch.listMetrics(undefined, {region: expect})
      assert(actual.region === expect)

      _AWS.CloudWatch.restore()
    })

    it('should throws the error if the API call failed', async () => {
      const expect = 'error'
      AWS.mock('CloudWatch', 'listMetrics', (params, callback) => {
        callback(expect)
      })

      const cloudWatch = new CloudWatch()
      try {
        await cloudWatch.listMetrics()
        assert(false)
      } catch (error) {
        assert(error === expect)
      }
    })
  })

  describe('getMetricData', () => {
    it('should return a list of datapoints', async () => {
      const curr = new Date()
      const expect = {Datapoints: [
        {Timestamp: curr, Average: '1'},
        {Timestamp: new Date(curr.getTime() + 1), Average: '2'}
      ]}
      AWS.mock('CloudWatch', 'getMetricStatistics', (params, callback) => {
        callback(null, expect)
      })

      const cloudWatch = new CloudWatch()
      const actual = await cloudWatch.getMetricData({Namespace: '', MetricName: ''}, curr, curr)

      assert(actual.length === expect.Datapoints.length)
    })

    it('should return a list of datapoints in the order of timestamp', async () => {
      const curr = new Date()
      const expect = {Datapoints: [
        {Timestamp: curr, Average: '1'},
        {Timestamp: new Date(curr.getTime() - 1), Average: '2'}
      ]}
      AWS.mock('CloudWatch', 'getMetricStatistics', (params, callback) => {
        callback(null, expect)
      })

      const cloudWatch = new CloudWatch()
      const actual = await cloudWatch.getMetricData({Namespace: '', MetricName: ''}, curr, curr)

      assert(actual.length === expect.Datapoints.length)
      assert(actual[0].value === expect.Datapoints[1].Average)
      assert(actual[1].value === expect.Datapoints[0].Average)
    })

    it('should set longer prioed if the start time is two weeks before', async () => {
      const expect = {Datapoints: []}
      let actual
      AWS.mock('CloudWatch', 'getMetricStatistics', (params, callback) => {
        actual = params
        callback(null, expect)
      })

      const cloudWatch = new CloudWatch()
      const curr = new Date()
      curr.setDate(curr.getDate() - 15)
      await cloudWatch.getMetricData({Namespace: '', MetricName: ''}, curr, curr)

      assert(actual.Period === 300)
    })

    it('should use ExtendedStatistics if the statistics is pXX', async () => {
      const curr = new Date()
      const stat = 'p90'
      const expect = {Datapoints: [
        {Timestamp: curr, ExtendedStatistics: {[stat]: '1'}},
        {Timestamp: new Date(curr.getTime() + 1), ExtendedStatistics: {[stat]: '2'}}
      ]}
      AWS.mock('CloudWatch', 'getMetricStatistics', (params, callback) => {
        assert(params.ExtendedStatistics.length === 1)
        assert(params.ExtendedStatistics[0] === stat)
        callback(null, expect)
      })

      const cloudWatch = new CloudWatch()
      const props = {Namespace: '', MetricName: '', Statistics: stat}
      const actual = await cloudWatch.getMetricData(props, curr, curr)

      assert(actual.length === expect.Datapoints.length)
      assert(actual[0].value === '1')
      assert(actual[1].value === '2')
    })

    it('should throws the error if the API call failed', async () => {
      const expect = 'error'
      AWS.mock('CloudWatch', 'getMetricStatistics', (params, callback) => {
        callback(expect)
      })

      const cloudWatch = new CloudWatch()
      try {
        const curr = new Date()
        await cloudWatch.getMetricData({Namespace: '', MetricName: ''}, curr, curr)
        assert(false)
      } catch (error) {
        assert(error === expect)
      }
    })
  })
})
