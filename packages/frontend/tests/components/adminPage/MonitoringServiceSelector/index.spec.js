import { metricsSelectorManager } from 'components/adminPage/MonitoringServiceSelector'

describe('MetricsSelectorManager', () => {
  describe('get', () => {
    it('should return the associated selector', () => {
      const name = 'test'
      const expect = 'selector'
      metricsSelectorManager.register(name, expect)
      const actual = metricsSelectorManager.get(name)
      assert(actual === expect)
    })

    it('should throw error if the service is unknown', () => {
      const name = 'test'
      metricsSelectorManager.register(name, '')
      try {
        metricsSelectorManager.get('unknown')
        assert(false)
      } catch (err) {
        assert(err.name.match(/Error/))
      }
    })
  })
})
