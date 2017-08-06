import React from 'react'
import c3 from 'c3'
import { mount } from 'enzyme'
import MetricsGraph from 'components/common/MetricsGraph/MetricsGraph'
import classes from 'components/common/MetricsGraph/MetricsGraph.scss'
import { timeframes, getNumDates } from 'utils/status'

describe('MetricsGraph', () => {
  const generateProps = () => {
    return {
      metricID: '1',
      metric: {title: '', unit: '', data: {}},
      settings: {statusPageURL: 'example.com'},
      timeframe: timeframes[0],
      fetchData: sinon.spy()
    }
  }

  const buildDates = () => {
    const currDate = new Date()
    const today = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
    currDate.setDate(currDate.getDate() - 1)
    const yesterday = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
    return [yesterday, today]
  }

  describe('componentDidMount', () => {
    it('should fetch MetricData if URL is available', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      // failed to change the method of MetricsGraph class. Change the method of instance instead.
      inst.fetchMetricData = sinon.spy()
      // call componentDidMount directly. The instance is re-created if unmount() and mount() are called.
      inst.componentDidMount()

      assert(graph.state().needUpdateGraph === false)
      assert(inst.fetchMetricData.callCount === 1)
    })

    it('should set state if all data are fetched', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData = sinon.spy()
      inst.areAllDataFetched = () => { return true }
      inst.componentDidMount()

      assert(graph.state().needUpdateGraph === true)
      assert(inst.fetchMetricData.callCount === 0)
    })
  })

  describe('componentDidUpdate', () => {
    it('should fetch MetricData if URL is available', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData = sinon.spy()
      inst.componentDidUpdate({settings: {statusPageURL: ''}})

      assert(inst.fetchMetricData.callCount === 1)
    })

    it('should update Graph if all data are fetched', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData = sinon.spy()
      inst.updateGraph = sinon.spy()
      inst.areAllDataFetched = () => { return true }
      inst.componentDidUpdate(props)

      assert(inst.fetchMetricData.callCount === 0)
      assert(inst.updateGraph.callCount === 1)
    })

    it('should fetch MetricData if timeframe is changed', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData = sinon.spy()
      inst.updateGraph = sinon.spy()
      inst.componentDidUpdate({
        ...props,
        timeframe: timeframes[1]
      })

      assert(inst.fetchMetricData.callCount === 1)
      assert(inst.updateGraph.callCount === 0)
    })
  })

  describe('fetchMetricData', () => {
    it('should fetch Data', () => {
      const props = generateProps()
      props.settings.statusPageURL = undefined
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData()

      assert(props.fetchData.callCount === getNumDates(props.timeframe) + 1)
    })
  })

  describe('areAllDataFetched', () => {
    it('should return false if data is undefined', () => {
      const props = generateProps()
      props.metric.data = undefined
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.areAllDataFetched() === false)
    })

    it('should return false if some data are not fetched yet', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      const currDate = new Date()
      const key = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`

      assert(inst.areAllDataFetched({[key]: []}) === false)
    })

    it('should return true if all data are fetched', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      const dates = buildDates()
      assert(inst.areAllDataFetched({[dates[0]]: [], [dates[1]]: []}))
    })
  })

  describe('collectDataWithinRange', () => {
    it('should collect data within the specified range', () => {
      const props = generateProps()
      const dates = buildDates()
      dates.push('2017-6-1')
      const data = {
        [dates[0]]: [{timestamp: 0}, {timestamp: 1}],
        [dates[1]]: [{timestamp: 2}, {timestamp: 3}]
      }
      props.metric.data = data
      const graph = mount(<MetricsGraph {...props} />)
      const filteredData = graph.instance().collectDataWithinRange(dates, 1, 2)

      assert(filteredData.length === 2)
      assert(filteredData[0].timestamp === 1)
      assert(filteredData[1].timestamp === 2)
    })
  })

  describe('averageDataByInterval', () => {
    it('should return null list if no data', () => {
      const data = []
      const startDate = new Date('2017-06-01T00:00:00.000Z')
      const endDate = new Date('2017-06-02T00:00:00.000Z')
      const incrementTimestamp = timestamp => timestamp.setDate(timestamp.getDate() + 1)

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      const { timestamps, values } = inst.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === startDate.toISOString())
      assert(values[0] === null)
      assert(timestamps[1].toISOString() === endDate.toISOString())
      assert(values[1] === null)
    })

    it('should average data by the interval', () => {
      const data = [
        {timestamp: '2017-06-01T00:00:00.000Z', value: 1},
        {timestamp: '2017-06-02T00:00:00.000Z', value: 2},
        {timestamp: '2017-06-03T00:00:00.000Z', value: 3},
        {timestamp: '2017-06-04T00:00:00.000Z', value: 4}
      ]
      const startDate = new Date(data[0].timestamp)
      const endDate = new Date(data[data.length - 1].timestamp)
      const incrementTimestamp = timestamp => timestamp.setDate(timestamp.getDate() + 2)

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      const { timestamps, values } = inst.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === data[0].timestamp)
      assert(values[0] === 1)
      assert(timestamps[1].toISOString() === data[2].timestamp)
      assert(values[1] === 3)
    })

    it('should ignore data out of range', () => {
      const data = [
        {timestamp: '2017-06-01T00:00:00.000Z', value: 1},
        {timestamp: '2017-06-02T00:00:00.000Z', value: 2},
        {timestamp: '2017-06-03T00:00:00.000Z', value: 3},
        {timestamp: '2017-06-04T00:00:00.000Z', value: 4},
        {timestamp: '2017-06-05T00:00:00.000Z', value: 5}
      ]
      const startDate = new Date(data[1].timestamp)
      const endDate = new Date(data[data.length - 2].timestamp)
      const incrementTimestamp = timestamp => timestamp.setDate(timestamp.getDate() + 2)

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      const { timestamps, values } = inst.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === data[1].timestamp)
      assert(values[0] === 2)
      assert(timestamps[1].toISOString() === data[3].timestamp)
      assert(values[1] === 4)
    })

    it('should let the average data have same precision as source values', () => {
      const data = [
        {timestamp: '2017-06-01T00:00:00.000Z', value: 1.0},
        {timestamp: '2017-06-02T00:00:00.000Z', value: 1.5},
        {timestamp: '2017-06-03T00:00:00.000Z', value: 3.5},
        {timestamp: '2017-06-04T00:00:00.000Z', value: 3.99}
      ]
      const startDate = new Date(data[0].timestamp)
      const endDate = new Date(data[data.length - 1].timestamp)
      const incrementTimestamp = timestamp => timestamp.setDate(timestamp.getDate() + 2)

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      const { timestamps, values } = inst.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === data[0].timestamp)
      assert(values[0] === 1.2)
      assert(timestamps[1].toISOString() === data[2].timestamp)
      assert(values[1] === 3.74)
    })
  })

  describe('ceil', () => {
    it('should return the ceiled value', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.ceil(0) === 0)
      assert(inst.ceil(0.5) === 1)
      assert(inst.ceil(1) === 1)
      assert(inst.ceil(1.5) === 2)
      assert(inst.ceil(2) === 2)
      assert(inst.ceil(10) === 10)
      assert(inst.ceil(11) === 20)
      assert(inst.ceil(19) === 20)
      assert(inst.ceil(90) === 90)
      assert(inst.ceil(91) === 100)
    })
  })

  describe('floor', () => {
    it('should return the floored value', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.floor(0) === 0)
      assert(inst.floor(0.5) === 0)
      assert(inst.floor(1) === 1)
      assert(inst.floor(1.5) === 1)
      assert(inst.floor(2) === 2)
      assert(inst.floor(10) === 10)
      assert(inst.floor(11) === 10)
      assert(inst.floor(19) === 10)
      assert(inst.floor(90) === 90)
      assert(inst.floor(91) === 90)
    })
  })

  describe('cutDecimalPart', () => {
    it('should return the given value if the value is integer', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.cutDecimalPart(0) === 0)
      assert(inst.cutDecimalPart(1) === 1)
      assert(inst.cutDecimalPart(10) === 10)
      assert(inst.cutDecimalPart(100) === 100)
    })

    it('should cut decimal part but leave some of them as specified', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.cutDecimalPart(0.1, 0) === 0)
      assert(inst.cutDecimalPart(0.1, 1) === 0.1)
      assert(inst.cutDecimalPart(0.1, 2) === 0.1)
      assert(inst.cutDecimalPart(1.1, 0) === 1)
      assert(inst.cutDecimalPart(1.1, 1) === 1.1)
      assert(inst.cutDecimalPart(1.1, 2) === 1.1)
      assert(inst.cutDecimalPart(1.11, 0) === 1)
      assert(inst.cutDecimalPart(1.11, 1) === 1.1)
      assert(inst.cutDecimalPart(1.11, 2) === 1.11)
      assert(inst.cutDecimalPart(1.11, 3) === 1.11)
      assert(inst.cutDecimalPart(11.11, 0) === 11)
      assert(inst.cutDecimalPart(11.11, 1) === 11.1)
      assert(inst.cutDecimalPart(11.11, 2) === 11.11)
      assert(inst.cutDecimalPart(11.11, 3) === 11.11)
      assert(inst.cutDecimalPart(99.9, 0) === 99)
      assert(inst.cutDecimalPart(99.9, 1) === 99.9)
      assert(inst.cutDecimalPart(99.9, 2) === 99.9)
      assert(inst.cutDecimalPart(99.99, 1) === 99.9)
    })
  })

  describe('calculateAvg', () => {
    it('should return 0 if no data', () => {
      const dates = buildDates()
      const data = {
        [dates[0]]: [],
        [dates[1]]: []
      }

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.calculateAvg(data) === 0)
    })

    it('should return the overall average', () => {
      const dates = buildDates()
      const data = {
        [dates[0]]: [{value: 1}, {value: 2}],
        [dates[1]]: [{value: 3}]
      }

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.calculateAvg(data) === 2)
    })
  })

  describe('updateGraph', () => {
    it('should update the graph using the data in props', () => {
      let graphParams
      sinon.stub(c3, 'generate', params => {
        graphParams = params
      })

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.collectDataWithinRange = sinon.stub().returns([1])
      inst.averageDataByInterval = sinon.stub().returns({
        timestamps: [new Date(), new Date(), new Date()],
        values: [1, 2, 3]
      })
      inst.updateGraph()

      assert(graphParams !== undefined)
      assert(graphParams.axis.y.min === 1)
      assert(graphParams.axis.y.max === 3)

      c3.generate.restore()
    })
  })

  describe('hasDatapoints', () => {
    it('should return true if there is any data', () => {
      const dates = buildDates()
      const data = {
        [dates[0]]: [{}],
        [dates[1]]: []
      }

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.hasDatapoints(data) === true)
    })

    it('should return false if no data', () => {
      const dates = buildDates()
      const data = {
        [dates[1]]: []
      }

      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.hasDatapoints(data) === false)
    })
  })

  describe('render', () => {
    it('should render the graph if all data are available', () => {
      const dates = buildDates()
      const data = {
        [dates[0]]: [{timestamp: 1, value: 1}],
        [dates[1]]: []
      }
      const props = generateProps()
      props.metric.data = data
      const graph = mount(<MetricsGraph {...props} />)

      assert(graph.find(`#metricID${props.metricID}`).length === 1)
    })

    it('should render the fetching message if some data are not available', () => {
      const dates = buildDates()
      const data = {
        [dates[0]]: [{timestamp: 1, value: 1}]
      }
      const props = generateProps()
      props.metric.data = data
      const graph = mount(<MetricsGraph {...props} />)

      assert(graph.find(`.${classes.loading}`).length === 1)
      assert(graph.find(`.${classes.loading}`).text().match(/Fetching/) !== null)
    })

    it('should render the no data message if no datapoints ', () => {
      const dates = buildDates()
      const data = {
        [dates[0]]: [],
        [dates[1]]: []
      }
      const props = generateProps()
      props.metric.data = data
      const graph = mount(<MetricsGraph {...props} />)

      assert(graph.find(`.${classes.loading}`).length === 1)
      assert(graph.find(`.${classes.loading}`).text().match(/No data/) !== null)
    })
  })
})
