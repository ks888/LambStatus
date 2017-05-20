import assert from 'assert'
import sinon from 'sinon'
import CloudWatch from 'aws/cloudWatch'
import { Metrics, Metric } from 'model/metrics'
import MetricsStore from 'db/metrics'
import { monitoringServices, metricStatusVisible, metricStatusHidden } from 'utils/const'

describe('Metrics', () => {
  describe('listExternal', () => {
    afterEach(() => {
      CloudWatch.prototype.listMetrics.restore()
    })

    it('should return a list of external metrics', async () => {
      const metrics = [{metricID: 1}, {metricID: 2}]
      sinon.stub(CloudWatch.prototype, 'listMetrics').returns(metrics)

      const comps = await new Metrics().listExternal()
      assert(comps.length === 2)
      assert(comps[0].metricID === 1)
      assert(comps[1].metricID === 2)
    })

    it('should return error when the store throws exception', async () => {
      sinon.stub(CloudWatch.prototype, 'listMetrics').throws()
      let error
      try {
        await new Metrics().listExternal()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('listPublic', () => {
    afterEach(() => {
      MetricsStore.prototype.getAll.restore()
    })

    it('should return a list of public metrics', async () => {
      const metrics = [{metricID: 1, status: metricStatusVisible}, {metricID: 2, status: metricStatusHidden}]
      sinon.stub(MetricsStore.prototype, 'getAll').returns(metrics)

      const comps = await new Metrics().listPublic()
      assert(comps.length === 1)
      assert(comps[0].metricID === 1)
    })

    it('should return error when the store throws exception', async () => {
      sinon.stub(MetricsStore.prototype, 'getAll').throws()
      let error
      try {
        await new Metrics().listPublic()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('list', () => {
    afterEach(() => {
      MetricsStore.prototype.getAll.restore()
    })

    it('should return a list of metrics', async () => {
      const metrics = [{metricID: 1}, {metricID: 2}]
      sinon.stub(MetricsStore.prototype, 'getAll').returns(metrics)

      const comps = await new Metrics().list()
      assert(comps.length === 2)
      assert(comps[0].metricID === 1)
      assert(comps[1].metricID === 2)
    })

    it('should return error when the store throws exception', async () => {
      sinon.stub(MetricsStore.prototype, 'getAll').throws()
      let error
      try {
        await new Metrics().list()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('lookup', () => {
    afterEach(() => {
      MetricsStore.prototype.getByID.restore()
    })

    it('should return one metric', async () => {
      sinon.stub(MetricsStore.prototype, 'getByID').returns([{metricID: 1}])

      const comp = await new Metrics().lookup(1)
      assert(comp.metricID === 1)
    })

    it('should return error when matched no metric', async () => {
      sinon.stub(MetricsStore.prototype, 'getByID').returns([])
      let error
      try {
        await new Metrics().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should return error when matched multiple metrics', async () => {
      sinon.stub(MetricsStore.prototype, 'getByID').returns([{metricID: 1}, {metricID: 1}])
      let error
      try {
        await new Metrics().lookup(1)
      } catch (e) {
        error = e
      }
      assert(error.name === 'Error')
    })
  })
})

describe('Metric', () => {
  describe('constructor', () => {
    it('should construct a new instance', () => {
      const comp = new Metric('1', 'type', 'title', 'unit', 'description', 'status', 1, {})
      assert(comp.metricID === '1')
      assert(comp.type === 'type')
      assert(comp.title === 'title')
      assert(comp.unit === 'unit')
      assert(comp.description === 'description')
      assert(comp.status === 'status')
      assert(comp.order === 1)
      assert.deepEqual(comp.props, {})
    })

    it('should fill in insufficient values', () => {
      const comp = new Metric(undefined, 'type', 'title', 'unit', 'description', 'status', undefined, {})
      assert(comp.metricID.length === 12)
      assert(typeof comp.order === 'number')
    })
  })

  describe('validate', () => {
    const genMock = () => new Metric(undefined, monitoringServices[0], 'title', 'unit', 'description',
                                     metricStatusVisible, 1, {})
    it('should return no error when input is valid', async () => {
      const comp = genMock()
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when metricID is invalid', async () => {
      const comp = genMock()
      comp.metricID = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when metricID does not exist', async () => {
      sinon.stub(MetricsStore.prototype, 'getByID').returns([])
      const comp = new Metric('1', monitoringServices[0], 'title', 'unit', 'description',
                              metricStatusVisible, 1, {})
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
      MetricsStore.prototype.getByID.restore()
    })

    it('should return error when type is invalid', async () => {
      const comp = genMock()
      comp.type = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when title is invalid', async () => {
      const comp = genMock()
      comp.title = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return no error when unit is empty', async () => {
      const comp = genMock()
      comp.unit = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when unit is invalid', async () => {
      const comp = genMock()
      comp.unit = undefined
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return no error when description is empty', async () => {
      const comp = genMock()
      comp.description = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })

    it('should return error when description is invalid', async () => {
      const comp = genMock()
      comp.description = undefined
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when status is invalid', async () => {
      const comp = genMock()
      comp.status = ''
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when order is string', async () => {
      const comp = genMock()
      comp.order = 'order'
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when order is float', async () => {
      const comp = genMock()
      comp.order = 1.1
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })

    it('should return error when props is string', async () => {
      const comp = genMock()
      comp.props = '{}'
      let error
      try {
        await comp.validate()
      } catch (e) {
        error = e
      }
      assert(error.name === 'ValidationError')
    })
  })
})
