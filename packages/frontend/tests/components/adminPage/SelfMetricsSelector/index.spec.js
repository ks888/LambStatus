import SelfMetricsSelector from 'components/adminPage/SelfMetricsSelector'

describe('SelfMetricsSelector', () => {
  describe('monitoringServiceName', () => {
    it('should return the service name without instantiating the class', () => {
      assert(SelfMetricsSelector.monitoringServiceName === 'Self')
    })
  })
})
