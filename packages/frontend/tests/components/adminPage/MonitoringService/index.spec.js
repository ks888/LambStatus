import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import { MonitoringService, monitoringServiceManager } from 'components/adminPage/MonitoringService'

describe('MonitoringService', () => {
  it('getMetricsSelector should throw error', () => {
    const service = new MonitoringService()
    try {
      service.getMetricsSelector()
      assert(false)
    } catch (err) {
      assert(err.name.match(/Error/))
    }
  })

  it('getServiceName should throw error', () => {
    const service = new MonitoringService()
    try {
      service.getServiceName()
      assert(false)
    } catch (err) {
      assert(err.name.match(/Error/))
    }
  })

  it('getMessageInPreviewDialog should return default message', () => {
    const service = new MonitoringService()
    const Message = service.getMessageInPreviewDialog()
    const props = {}
    const msg = shallow(<Message {...props} />)
    assert(msg.text().match(/Note/))
  })
})

describe('MonitoringServiceManager', () => {
  describe('create', () => {
    it('should create a new instance', () => {
      const name = 'test'
      monitoringServiceManager.register(name, MonitoringService)
      const inst = monitoringServiceManager.create(name)
      assert(inst.constructor.name === MonitoringService.name)
    })

    it('should throw error if the service is unknown', () => {
      const name = 'test'
      monitoringServiceManager.register(name, MonitoringService)
      try {
        monitoringServiceManager.create('unknown')
        assert(false)
      } catch (err) {
        assert(err.name.match(/Error/))
      }
    })
  })
})
