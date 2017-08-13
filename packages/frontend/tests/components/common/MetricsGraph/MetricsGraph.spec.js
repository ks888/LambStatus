import React from 'react'
import c3 from 'c3'
import { mount } from 'enzyme'
import MetricsGraph, { GraphDrawer, graphStatus } from 'components/common/MetricsGraph/MetricsGraph'
import classes from 'components/common/MetricsGraph/MetricsGraph.scss'
import { timeframes, getNumDates } from 'utils/status'

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

describe('GraphDrawer', () => {
  describe('ceil', () => {
    it('should return the ceiled value', () => {
      const drawer = new GraphDrawer()

      assert(drawer.ceil(0) === 0)
      assert(drawer.ceil(0.5) === 1)
      assert(drawer.ceil(1) === 1)
      assert(drawer.ceil(1.5) === 2)
      assert(drawer.ceil(2) === 2)
      assert(drawer.ceil(10) === 10)
      assert(drawer.ceil(11) === 20)
      assert(drawer.ceil(19) === 20)
      assert(drawer.ceil(90) === 90)
      assert(drawer.ceil(91) === 100)
    })
  })

  describe('floor', () => {
    it('should return the floored value', () => {
      const drawer = new GraphDrawer()

      assert(drawer.floor(0) === 0)
      assert(drawer.floor(0.5) === 0)
      assert(drawer.floor(1) === 1)
      assert(drawer.floor(1.5) === 1)
      assert(drawer.floor(2) === 2)
      assert(drawer.floor(10) === 10)
      assert(drawer.floor(11) === 10)
      assert(drawer.floor(19) === 10)
      assert(drawer.floor(90) === 90)
      assert(drawer.floor(91) === 90)
    })
  })

  describe('cutDecimalPart', () => {
    it('should return the given value if the value is integer', () => {
      const drawer = new GraphDrawer()

      assert(drawer.cutDecimalPart(0) === 0)
      assert(drawer.cutDecimalPart(1) === 1)
      assert(drawer.cutDecimalPart(10) === 10)
      assert(drawer.cutDecimalPart(100) === 100)
    })

    it('should cut decimal part but leave some of them as specified', () => {
      const drawer = new GraphDrawer()

      assert(drawer.cutDecimalPart(0.1, 0) === 0)
      assert(drawer.cutDecimalPart(0.1, 1) === 0.1)
      assert(drawer.cutDecimalPart(0.1, 2) === 0.1)
      assert(drawer.cutDecimalPart(1.1, 0) === 1)
      assert(drawer.cutDecimalPart(1.1, 1) === 1.1)
      assert(drawer.cutDecimalPart(1.1, 2) === 1.1)
      assert(drawer.cutDecimalPart(1.11, 0) === 1)
      assert(drawer.cutDecimalPart(1.11, 1) === 1.1)
      assert(drawer.cutDecimalPart(1.11, 2) === 1.11)
      assert(drawer.cutDecimalPart(1.11, 3) === 1.11)
      assert(drawer.cutDecimalPart(11.11, 0) === 11)
      assert(drawer.cutDecimalPart(11.11, 1) === 11.1)
      assert(drawer.cutDecimalPart(11.11, 2) === 11.11)
      assert(drawer.cutDecimalPart(11.11, 3) === 11.11)
      assert(drawer.cutDecimalPart(99.9, 0) === 99)
      assert(drawer.cutDecimalPart(99.9, 1) === 99.9)
      assert(drawer.cutDecimalPart(99.9, 2) === 99.9)
      assert(drawer.cutDecimalPart(99.99, 1) === 99.9)
    })
  })

  describe('formatNumber', () => {
    it('should format decimal part', () => {
      const drawer = new GraphDrawer()

      assert(drawer.formatNumber(0, 0) === '0')
      assert(drawer.formatNumber(0, 1) === '0.0')
      assert(drawer.formatNumber(0, 2) === '0.00')
      assert(drawer.formatNumber(0.1, 0) === '0')
      assert(drawer.formatNumber(0.1, 1) === '0.1')
      assert(drawer.formatNumber(0.1, 2) === '0.10')
      assert(drawer.formatNumber(0.11, 0) === '0')
      assert(drawer.formatNumber(0.11, 1) === '0.1')
      assert(drawer.formatNumber(0.11, 2) === '0.11')
    })

    it('should format integer part', () => {
      const drawer = new GraphDrawer()

      assert(drawer.formatNumber(10) === '10')
      assert(drawer.formatNumber(100) === '100')
      assert(drawer.formatNumber(1000) === '1,000')
      assert(drawer.formatNumber(1000000) === '1,000,000')
    })
  })

  describe('collectDataWithinRange', () => {
    it('should collect data within the specified range', () => {
      const dates = buildDates()
      dates.push('2017-6-1')
      const metric = {
        data: {
          [dates[0]]: [{timestamp: 0, value: 0}, {timestamp: 1, value: 1}],
          [dates[1]]: [{timestamp: 2, value: 2}, {timestamp: 3, value: 3}]
        }
      }
      const drawer = new GraphDrawer()
      const filteredData = drawer.collectDataWithinRange(metric, dates, 1, 2)

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

      const drawer = new GraphDrawer()
      const { timestamps, values } = drawer.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

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

      const drawer = new GraphDrawer()
      const { timestamps, values } = drawer.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === data[0].timestamp)
      assert(values[0] === 1.5)
      assert(timestamps[1].toISOString() === data[2].timestamp)
      assert(values[1] === 3.5)
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

      const drawer = new GraphDrawer()
      const { timestamps, values } = drawer.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === data[1].timestamp)
      assert(values[0] === 2.5)
      assert(timestamps[1].toISOString() === data[3].timestamp)
      assert(values[1] === 4)
    })

    it('should let the average data have specified decimal places', () => {
      const data = [
        {timestamp: '2017-06-01T00:00:00.000Z', value: 1.0},
        {timestamp: '2017-06-02T00:00:00.000Z', value: 1.5},
        {timestamp: '2017-06-03T00:00:00.000Z', value: 3.5},
        {timestamp: '2017-06-04T00:00:00.000Z', value: 3.99}
      ]
      const startDate = new Date(data[0].timestamp)
      const endDate = new Date(data[data.length - 1].timestamp)
      const incrementTimestamp = timestamp => timestamp.setDate(timestamp.getDate() + 2)

      const drawer = new GraphDrawer()
      const { timestamps, values } = drawer.averageDataByInterval(data, startDate, endDate, incrementTimestamp)

      assert(timestamps.length === 2)
      assert(values.length === 2)
      assert(timestamps[0].toISOString() === data[0].timestamp)
      assert(values[0] === 1.25)
      assert(timestamps[1].toISOString() === data[2].timestamp)
      assert(values[1] === 3.745)
    })
  })

  describe('calculateAverage', () => {
    it('should return 0 if no data', () => {
      const data = []
      const drawer = new GraphDrawer()

      assert(drawer.calculateAverage(data) === 0)
    })

    it('should return the overall average', () => {
      const data = [{value: 1}, {value: 2}, {value: 3}]
      const drawer = new GraphDrawer()

      assert(drawer.calculateAverage(data) === 2)
    })

    it('should remove some parts of demail digits', () => {
      const data = [{value: 0.1}, {value: 0.15}, {value: 0.2}]
      const drawer = new GraphDrawer()

      assert(drawer.calculateAverage(data) === 0.15)
    })
  })

  describe('draw', () => {
    it('should update the graph using the data in props', () => {
      let graphParams
      sinon.stub(c3, 'generate', params => {
        graphParams = params
      })

      const drawer = new GraphDrawer()
      drawer.collectDataWithinRange = sinon.stub().returns([{value: 1}])
      drawer.averageDataByInterval = sinon.stub().returns({
        timestamps: [new Date(), new Date(), new Date()],
        values: [1, 2, 3]
      })
      drawer.draw({decimalPlaces: 0}, timeframes[0])

      assert(graphParams !== undefined)
      assert(graphParams.axis.y.min === 1)
      assert(graphParams.axis.y.max === 3)

      c3.generate.restore()
    })
  })
})

describe('MetricsGraph', () => {
  describe('componentDidMount', () => {
    it('should fetch MetricData if URL is available', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      // failed to change the method of MetricsGraph class. Change the method of instance instead.
      inst.fetchMetricData = sinon.spy()
      // call componentDidMount directly. The instance is re-created if unmount() and mount() are called.
      inst.componentDidMount()

      assert(inst.fetchMetricData.calledOnce)
    })
  })

  describe('componentWillReceiveProps', () => {
    it('should fetch MetricData if URL gets available', () => {
      const props = generateProps()
      props.settings = {statusPageURL: ''}
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData = sinon.spy()
      inst.componentWillReceiveProps({settings: {statusPageURL: 'example.com'}})

      assert(inst.fetchMetricData.calledOnce)
    })

    it('should draw the graph if all data are fetched', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.draw = sinon.spy()
      inst.areAllDataFetched = sinon.stub().returns(true)
      inst.componentWillReceiveProps(props)

      assert(inst.draw.calledOnce)
    })

    it('should fetch MetricData if timeframe is changed', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData = sinon.spy()
      inst.graphDrawer.draw = sinon.stub().returns(false)
      inst.componentWillReceiveProps({
        ...props,
        timeframe: timeframes[1]
      })

      assert(inst.fetchMetricData.callCount === 1)
      assert(inst.graphDrawer.draw.callCount === 0)
    })
  })

  describe('fetchMetricData', () => {
    it('should fetch Data', () => {
      const props = generateProps()
      props.settings.statusPageURL = undefined
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.fetchMetricData(props.settings.statusPageURL, props.timeframe)

      assert(props.fetchData.callCount === getNumDates(props.timeframe) + 1)
    })
  })

  describe('draw', () => {
    it('should draw the graph and set ready state', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.graphDrawer.draw = sinon.stub().returns(true)
      inst.draw()

      assert(inst.graphDrawer.draw.calledOnce)
      assert(graph.state().status === graphStatus.ready)
    })

    it('should draw the graph and set failed state if failed to draw the graph', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.graphDrawer.draw = sinon.stub().returns(false)
      inst.draw()

      assert(inst.graphDrawer.draw.calledOnce)
      assert(graph.state().status === graphStatus.failed)
    })
  })

  describe('areAllDataFetched', () => {
    it('should return false if data is undefined', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      assert(inst.areAllDataFetched(undefined, props.timeframe) === false)
    })

    it('should return false if some data are not fetched yet', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      const currDate = new Date()
      const key = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`

      assert(inst.areAllDataFetched({[key]: []}, props.timeframe) === false)
    })

    it('should return true if all data are fetched', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()

      const dates = buildDates()
      assert(inst.areAllDataFetched({[dates[0]]: [], [dates[1]]: []}, props.timeframe))
    })
  })

  describe('render', () => {
    it('should render the graph if the graph is ready', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      const inst = graph.instance()
      inst.graphDrawer.average = 'AVERAGE'
      graph.setState({status: graphStatus.ready})

      assert(graph.find(`#metricID${props.metricID}`).length === 1)
      assert(graph.text().match(/AVERAGE/) !== null)
    })

    it('should render the fetching message if graph status is preparing', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      graph.setState({status: graphStatus.preparing})

      assert(graph.find(`.${classes.loading}`).length === 1)
      assert(graph.find(`.${classes.loading}`).text().match(/Fetching/) !== null)
    })

    it('should render the no data message if graph status is failed ', () => {
      const props = generateProps()
      const graph = mount(<MetricsGraph {...props} />)
      graph.setState({status: graphStatus.failed})

      assert(graph.find(`.${classes.loading}`).length === 1)
      assert(graph.find(`.${classes.loading}`).text().match(/No data/) !== null)
    })
  })
})
