import React from 'react'
import { mount } from 'enzyme'
import MetricsGraph from 'components/common/MetricsGraph/MetricsGraph'
import { timeframes, getNumDates } from 'utils/status'

describe('MetricsGraph', () => {
  const generateProps = () => {
    return {
      metric: {title: '', unit: '', data: {}},
      settings: {statusPageURL: 'example.com'},
      timeframe: timeframes[0],
      fetchData: sinon.spy()
    }
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

      const currDate = new Date()
      const today = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`
      currDate.setDate(currDate.getDate() - 1)
      const yesterday = `${currDate.getUTCFullYear()}-${currDate.getUTCMonth() + 1}-${currDate.getUTCDate()}`

      assert(inst.areAllDataFetched({[today]: [], [yesterday]: []}))
    })
  })
})
