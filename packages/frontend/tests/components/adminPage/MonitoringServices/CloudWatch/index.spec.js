import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import CloudWatch from 'components/adminPage/MonitoringServices/CloudWatch'

describe('CloudWatch', () => {
  describe('getMetricsSelector', () => {
    it('should return the cloud watch metrics selector', () => {
      const cloudWatch = new CloudWatch()
      const Selector = cloudWatch.getMetricsSelector()
      const store = buildEmptyStore({
          metrics: {
            externalMetrics: {}
          }
      })
      const props = {}
      const selector = mount(<Provider store={store}><Selector {...props} /></Provider>)
      assert(selector.find('CloudWatchMetricsSelector').exists())
    })
  })

  describe('getServiceName', () => {
    it('should return the service name', () => {
      const cloudWatch = new CloudWatch()
      assert(cloudWatch.getServiceName() === 'CloudWatch')
    })
  })
})
