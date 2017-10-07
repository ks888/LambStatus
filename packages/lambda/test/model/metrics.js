import assert from 'assert'
import sinon from 'sinon'
import CloudFormation from 'aws/cloudFormation'
import S3 from 'aws/s3'
import { Metric } from 'model/metrics'
import { metricStatusVisible } from 'utils/const'

describe('Metric', () => {
  const generateConstructorParams = (metricID) => {
    return {
      metricID,
      type: 'Mock',
      title: 'title',
      status: metricStatusVisible,
      unit: 'unit',
      description: 'description',
      decimalPlaces: 0,
      order: 0,
      props: {key: 'value'}
    }
  }

  const getBeginningOfToday = () => {
    const date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  describe('constructor', () => {
    it('should construct a new instance', () => {
      const params = generateConstructorParams('1')
      const metric = new Metric(params)

      assert(metric.metricID === params.metricID)
      assert(metric.type === params.type)
      assert(metric.title === params.title)
      assert(metric.unit === params.unit)
      assert(metric.description === params.description)
      assert(metric.decimalPlaces === params.decimalPlaces)
      assert(metric.status === params.status)
      assert(metric.order === params.order)
      assert.deepEqual(metric.props, params.props)
    })

    it('should fill in insufficient values', () => {
      const params = generateConstructorParams()
      params.unit = undefined
      params.description = undefined
      params.decimalPlaces = undefined
      params.props = undefined
      params.order = undefined
      const metric = new Metric(params)

      assert(metric.unit === '')
      assert(metric.description === '')
      assert(metric.decimalPlaces === 0)
      assert.deepEqual(metric.props, {})
      assert(metric.order !== undefined)
    })
  })

  describe('validate', () => {
    it('should return no error when input is valid', async () => {
      const params = generateConstructorParams('1')
      const metric = new Metric(params)

      let error
      try {
        await metric.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when metricID is invalid', async () => {
      const params = generateConstructorParams('')
      const metric = new Metric(params)

      let error
      try {
        await metric.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })

  describe('validateExceptID', () => {
    it('should return error when title is invalid', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.title = ''

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return no error when unit is empty', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.unit = ''

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when unit is invalid', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.unit = undefined

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return no error when description is empty', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.description = ''

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when description is invalid', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.description = undefined

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when decimalPlaces is invalid', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.decimalPlaces = undefined

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when decimalPlaces is float', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.decimalPlaces = 1.1

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when decimalPlaces is string', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.decimalPlaces = '1'

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.status = ''

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when order is string', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.order = 'order'

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when order is float', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.order = 1.1

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return no error when props is null', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.props = null

      let error
      try {
        await metric.validateExceptID()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })
  })

  describe('normalizeDatapoints', () => {
    it('should sort in the order of timestamp ', async () => {
      const datapoints = [
        { timestamp: '2017-07-31T14:18:00.000Z', value: 23 },
        { timestamp: '2017-07-31T14:17:00.000Z', value: 22 },
        { timestamp: '2017-07-31T14:16:00.000Z', value: 21 },
        { timestamp: '2017-07-31T14:15:00.000Z', value: 20 },
        { timestamp: '2017-07-31T14:14:00.000Z', value: 19 },
        { timestamp: '2017-07-31T14:13:00.000Z', value: 18 },
        { timestamp: '2017-07-31T14:12:00.000Z', value: 17 },
        { timestamp: '2017-07-31T14:11:00.000Z', value: 16 },
        { timestamp: '2017-07-31T14:10:00.000Z', value: 15 },
        { timestamp: '2017-07-31T14:09:00.000Z', value: 14 },
        { timestamp: '2017-07-31T14:08:00.000Z', value: 13 },
        { timestamp: '2017-07-31T14:07:00.000Z', value: 12 },
        { timestamp: '2017-07-31T14:06:00.000Z', value: 11 },
        { timestamp: '2017-07-31T14:05:00.000Z', value: 10 },
        { timestamp: '2017-07-31T14:04:00.000Z', value: 9 },
        { timestamp: '2017-07-31T14:03:00.000Z', value: 8 },
        { timestamp: '2017-07-31T14:02:00.000Z', value: 7 },
        { timestamp: '2017-07-31T14:01:00.000Z', value: 6 },
        { timestamp: '2017-07-31T14:00:00.000Z', value: 5 },
        { timestamp: '2017-07-31T13:59:00.000Z', value: 4 },
        { timestamp: '2017-07-31T13:58:00.000Z', value: 3 },
        { timestamp: '2017-07-31T13:57:00.000Z', value: 2 },
        { timestamp: '2017-07-31T13:56:00.000Z', value: 1 },
        { timestamp: '2017-07-31T13:55:00.000Z', value: 0 }
      ]

      const params = generateConstructorParams()
      const metric = new Metric(params)
      const actual = await metric.normalizeDatapoints(datapoints)

      Object.keys(actual).forEach((k, i) => {
        assert(actual[k].timestamp.endsWith('00.000Z'))
        assert(actual[k].value === i)
      })
    })
  })

  describe('insertDatapoints', () => {
    it('should insert a datapoint in the order of timestamp', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const date = new Date(2017, 6, 3, 0, 0, 0)
      const existingDatapoints = [{timestamp: '2017-07-03T01:00:00.000Z', value: 1}]
      metric.setDatapoints(date, existingDatapoints)

      const newDatapoints = [{timestamp: '2017-07-03T00:00:00.000Z', value: 0}]
      const insertedData = await metric.insertDatapoints(newDatapoints)
      assert(insertedData.length === 1)

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 2)
      assert(actual[0].timestamp === newDatapoints[0].timestamp)
      assert(actual[1].timestamp === existingDatapoints[0].timestamp)
    })

    it('should create new S3 object if the object does not exist', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const newDatapoints = [{timestamp: '2017-07-03T00:00:00.000Z', value: 0}]

      const insertedData = await metric.insertDatapoints(newDatapoints)
      assert(insertedData.length === 1)

      const actual = await metric.getDatapoints(new Date(2017, 6, 3, 0, 0, 0))
      assert(actual.length === 1)
      assert(actual[0].timestamp === newDatapoints[0].timestamp)
      assert(actual[0].value === newDatapoints[0].value)
    })

    it('should insert multiple datapoints in the order of timestamp', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const date = new Date(2017, 6, 3, 0, 0, 0)
      const existingDatapoints = [{timestamp: '2017-07-03T02:00:00.000Z', value: 2}]
      metric.setDatapoints(date, existingDatapoints)

      const newDatapoints = [{timestamp: '2017-07-03T01:00:00.000Z', value: 1},
                             {timestamp: '2017-07-03T00:00:00.000Z', value: 0}]
      const insertedData = await metric.insertDatapoints(newDatapoints)
      assert(insertedData.length === 2)

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 3)
      assert(actual[0].value === 0)
      assert(actual[1].value === 1)
      assert(actual[2].value === 2)
    })

    it('should update multiple objects if there are multiple dates', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)

      const newDatapoints = [{timestamp: '2017-07-02T00:00:00.000Z', value: 0},
                             {timestamp: '2017-07-03T00:00:00.000Z', value: 1}]
      const insertedData = await metric.insertDatapoints(newDatapoints)
      assert(insertedData.length === 2)

      let date = new Date(2017, 6, 2, 0, 0, 0)
      let actual = await metric.getDatapoints(date)
      assert(actual.length === 1)
      assert(actual[0].timestamp === newDatapoints[0].timestamp)

      date = new Date(2017, 6, 3, 0, 0, 0)
      actual = await metric.getDatapoints(date)
      assert(actual.length === 1)
      assert(actual[0].timestamp === newDatapoints[1].timestamp)
    })

    it('should update the existing datapoints if the timestamp is virtually same', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const date = new Date(2017, 6, 3, 0, 0, 0)
      const existingDatapoints = [{timestamp: '2017-07-03T01:00:00.000Z', value: 1}]
      metric.setDatapoints(date, existingDatapoints)

      const newDatapoints = [{timestamp: '2017-07-03T01:00:05.000Z', value: 2}]
      const insertedData = await metric.insertDatapoints(newDatapoints)
      assert(insertedData.length === 1)

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 1)
      assert(actual[0].timestamp === newDatapoints[0].timestamp)
      assert(actual[0].value === newDatapoints[0].value)
    })

    it('should insert one datapoint if there are 2 data points in one minute', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const date = new Date(2017, 6, 3, 0, 0, 0)
      metric.setDatapoints(date, [])

      const newDatapoints = [
        {timestamp: '2017-07-03T01:00:01.000Z', value: 1},
        {timestamp: '2017-07-03T01:00:02.000Z', value: 2},
        {timestamp: '2017-07-03T01:00:03.000Z', value: 3}
      ]
      const insertedData = await metric.insertDatapoints(newDatapoints)
      assert(insertedData.length === 1)

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 1)
      assert(actual[0].timestamp === newDatapoints[0].timestamp)
      assert(actual[0].value === newDatapoints[0].value)
    })

    it('should throw error if the timestamp is invalid', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const newDatapoints = [{timestamp: 'invalid', value: 1}]
      try {
        await metric.insertDatapoints(newDatapoints)
        assert(false)
      } catch (error) {
        assert(error.message.match(/invalid/))
      }
    })
  })

  describe('calculateUncollectedDates', () => {
    it('should return 0 if no uncollected dates', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const date = new Date(2017, 6, 3, 0, 0, 0)
      metric.setDatapoints(date, [])

      const actual = await metric.calculateUncollectedDates(date)
      assert(actual === 0)
    })

    it('should return 1 if no today\'s data', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      const yesterday = new Date(2017, 6, 2, 0, 0, 0)
      const today = new Date(2017, 6, 3, 0, 0, 0)
      metric.setDatapoints(yesterday, [])

      const actual = await metric.calculateUncollectedDates(today)
      assert(actual === 1)
    })

    it('should return 30 if no data', async () => {
      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.getDatapoints = sinon.spy()

      const date = new Date(2017, 6, 3, 0, 0, 0)
      const actual = await metric.calculateUncollectedDates(date)
      assert(actual === 30)
    })
  })

  describe('collect', () => {
    afterEach(() => {
      MockService.prototype.getMetricData.restore()
    })

    it('should collect a datapoint and insert it', async () => {
      const date = getBeginningOfToday()
      const newDatapoints = [{timestamp: date.toISOString(), value: 1}]
      const getMetricDataStub = sinon.stub(MockService.prototype, 'getMetricData').returns(newDatapoints)

      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.calculateUncollectedDates = () => 0
      await metric.collect()

      const actual = await metric.getDatapoints(new Date())
      assert(actual.length === newDatapoints.length)
      assert(actual[0].timestamp === newDatapoints[0].timestamp.substr(0, 16) + ':00.000Z')
      assert(actual[0].value === newDatapoints[0].value)

      const actualBegin = getMetricDataStub.args[0][2]
      const actualEnd = getMetricDataStub.args[0][3]
      const now = new Date()
      assert(actualBegin.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime())
      assert(actualEnd.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime())
    })

    it('should collect a yesterday\'s datapoint if it does not exist', async () => {
      const getMetricDataStub = sinon.stub(MockService.prototype, 'getMetricData').returns([])

      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.calculateUncollectedDates = () => 1
      await metric.collect()

      assert(getMetricDataStub.calledTwice)

      const argsAtSecondCall = getMetricDataStub.args[1]
      const actualBegin = argsAtSecondCall[2]
      const actualEnd = argsAtSecondCall[3]
      const now = new Date()
      assert(actualBegin.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).getTime())
      assert(actualEnd.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime())
    })

    it('should append to existing datapoints', async () => {
      const date = getBeginningOfToday()
      const existingDatapoints = [{timestamp: date.toISOString(), value: 1}]
      date.setHours(1)
      const newDatapoints = [{timestamp: date.toISOString(), value: 2}]
      sinon.stub(MockService.prototype, 'getMetricData').returns(newDatapoints)

      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.calculateUncollectedDates = () => 0
      metric.setDatapoints(date, existingDatapoints)
      await metric.collect()

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 2)
      assert(actual[0].timestamp === existingDatapoints[0].timestamp)
      assert(actual[1].timestamp === newDatapoints[0].timestamp)
    })

    it('should not append the datapoint if the same-timestamp data already exists', async () => {
      const date = getBeginningOfToday()
      const existingDatapoints = [{timestamp: date.toISOString(), value: 1}]
      date.setSeconds(1)
      const newDatapoints = [{timestamp: date.toISOString(), value: 2}]
      sinon.stub(MockService.prototype, 'getMetricData').returns(newDatapoints)

      const params = generateConstructorParams()
      const metric = new Metric(params)
      metric.calculateUncollectedDates = () => 0
      metric.setDatapoints(date, existingDatapoints)
      await metric.collect()

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 1)
    })
  })
})
