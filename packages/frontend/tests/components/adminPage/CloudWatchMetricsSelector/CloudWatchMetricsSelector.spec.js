import React from 'react'
import { mount } from 'enzyme'
import Spinner from 'components/common/Spinner'
import DropdownList from 'components/common/DropdownList'
import CloudWatchMetricsSelector from 'components/adminPage/CloudWatchMetricsSelector/CloudWatchMetricsSelector'

describe('CloudWatchMetricsSelector', () => {
  const generateProps = () => {
    return {
      onChange: sinon.spy(),
      fetchExternalMetrics: sinon.spy()
    }
  }

  describe('monitoringServiceName', () => {
    it('should return the service name without instantiating the class', () => {
      assert(CloudWatchMetricsSelector.monitoringServiceName === 'CloudWatch')
    })
  })

  describe('constructor', () => {
    it('should initialize state by the given props', () => {
      const props = generateProps()
      props.props = {
        Region: 'eu-central-1',
        Namespace: 'namespace',
        MetricName: 'metricname',
        Dimensions: [{Name: 'name', Value: 'value'}]
      }
      const selector = new CloudWatchMetricsSelector(props)
      assert(selector.state.regionName === 'EU (Frankfurt)')
      assert(selector.state.namespace === props.props.Namespace)
      assert(selector.state.metric === selector.buildMetricExpression(props.props))
      assert(selector.state.isFetching === false)
    })

    it('should set default values if props are empty', () => {
      const props = generateProps()
      const selector = new CloudWatchMetricsSelector(props)
      assert(selector.region === 'ap-northeast-1')
      assert(selector.state.regionName === 'Asia Pacific (Tokyo)')
      assert(selector.state.namespace === '')
      assert(selector.state.metric === '')
    })
  })

  describe('componentDidMount', () => {
    it('should fetch external metrics if no metrics', () => {
      const props = generateProps()
      mount(<CloudWatchMetricsSelector {...props} />)
      assert(props.fetchExternalMetrics.calledOnce)
    })

    it('should fetch external metrics if the region is changed', () => {
      const props = generateProps()
      props.metrics = []
      props.filters = {region: 'eu-central-1'}
      mount(<CloudWatchMetricsSelector {...props} />)
      assert(props.fetchExternalMetrics.calledOnce)
    })

    it('should not fetch external metrics if metrics are already fetched', () => {
      const props = generateProps()
      props.metrics = []
      props.filters = {region: 'ap-northeast-1'}
      mount(<CloudWatchMetricsSelector {...props} />)
      assert(props.fetchExternalMetrics.notCalled)
    })
  })

  describe('render', () => {
    it('should show namespaces and metrics if metrics are already fetched', () => {
      const props = generateProps()
      props.metrics = [
        {Namespace: 'ns1', MetricName: 'm1', Dimensions: [{Name: 'name', Value: 'value'}]},
        {Namespace: 'ns1', MetricName: 'm2', Dimensions: [{Name: 'name', Value: 'value'}]},
        {Namespace: 'ns2', MetricName: 'm3', Dimensions: [{Name: 'name', Value: 'value'}]}
      ]
      props.filters = {region: 'ap-northeast-1'}
      const selector = mount(<CloudWatchMetricsSelector {...props} />)
      const namespaces = selector.find(DropdownList).at(1).props().list
      const metrics = selector.find(DropdownList).at(2).props().list

      assert.deepEqual(namespaces, ['', 'ns1', 'ns2'])
      assert.deepEqual(metrics, [''])
    })

    it('should show given namespaces and metrics if metrics are not fetched', () => {
      const props = generateProps()
      props.props = {Namespace: 'ns1', MetricName: 'm1', Dimensions: [{Name: 'name', Value: 'value'}]}
      props.fetchExternalMetrics = (s, p, callbacks) => { callbacks.onLoad() }
      const selector = mount(<CloudWatchMetricsSelector {...props} />)

      const namespaces = selector.find(DropdownList).at(1).props().list
      const metrics = selector.find(DropdownList).at(2).props().list
      assert.deepEqual(namespaces, ['ns1'])
      assert.deepEqual(metrics, [selector.instance().buildMetricExpression(props.props)])

      const spinner = selector.find(Spinner)
      assert(spinner.length === 2) // namespace and metrics
    })

    it('should fetch external metrics if the region is changed', () => {
      const props = generateProps()
      props.metrics = [
        {Namespace: 'ns1', MetricName: 'm1', Dimensions: [{Name: 'name', Value: 'value'}]},
        {Namespace: 'ns1', MetricName: 'm2', Dimensions: [{Name: 'name', Value: 'value'}]},
        {Namespace: 'ns2', MetricName: 'm3', Dimensions: [{Name: 'name', Value: 'value'}]}
      ]
      props.filters = {region: 'ap-northeast-1'}
      const selector = mount(<CloudWatchMetricsSelector {...props} />)
      selector.instance().handleChangeRegion('EU (Frankfurt)')

      assert(props.fetchExternalMetrics.calledOnce)
    })

    it('should call onChange if the metric is changed', () => {
      const props = generateProps()
      props.metrics = [
        {Namespace: 'ns1', MetricName: 'm1', Dimensions: [{Name: 'name', Value: 'value'}]},
        {Namespace: 'ns1', MetricName: 'm2', Dimensions: [{Name: 'name', Value: 'value'}]},
        {Namespace: 'ns2', MetricName: 'm3', Dimensions: [{Name: 'name', Value: 'value'}]}
      ]
      props.filters = {region: 'ap-northeast-1'}
      const selector = mount(<CloudWatchMetricsSelector {...props} />)
      const selectedMetric = selector.instance().buildMetricExpression(
        {Namespace: 'ns1', MetricName: 'm1', Dimensions: [{Name: 'name', Value: 'value'}]}
      )
      selector.instance().handleChangeMetric(selectedMetric)

      assert(props.onChange.calledOnce)
    })
  })
})
