import React from 'react'
import { shallow } from 'enzyme'
import Self from 'components/adminPage/MonitoringServices/Self'

describe('Self', () => {
  describe('getMetricsSelector', () => {
    it('should return the self metrics selector', () => {
      const self = new Self()
      const Selector = self.getMetricsSelector()
      const store = buildEmptyStore({})
      const props = {}
      const selector = shallow(<Selector {...props} />)
      assert(selector.text().match(/submit/) !== null)
    })
  })

  describe('getServiceName', () => {
    it('should return the service name', () => {
      const self = new Self()
      assert(self.getServiceName() === 'Self')
    })
  })
})
