import assert from 'assert'
import { MonitoringService, monitoringServiceManager } from 'model/monitoringService'

describe('MonitoringService', () => {
  it('listMetrics should throw error', () => {
    const service = new MonitoringService()
    try {
      service.listMetrics()
      assert(false)
    } catch (err) {
      assert(err.name.match(/Error/))
    }
  })

  it('getMetricData should throw error', () => {
    const service = new MonitoringService()
    try {
      service.getMetricData()
      assert(false)
    } catch (err) {
      assert(err.name.match(/Error/))
    }
  })

  it('allowPostDatapointsAPI should return false', () => {
    const service = new MonitoringService()
    const actual = service.allowPostDatapointsAPI()
    assert(actual === false)
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
  })

  describe('create', () => {
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
