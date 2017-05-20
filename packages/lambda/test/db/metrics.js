import assert from 'assert'
import AWS from 'aws-sdk-mock'
import MetricsStore from 'db/metrics'

describe('MetricsStore', () => {
  describe('getAll', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a list of metrics', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{metricID: '1', props: '{"key": "value"}'}]})
      })
      const metrics = await new MetricsStore().getAll()
      assert(metrics.length === 1)
      assert(metrics[0].metricID === '1')
      assert(metrics[0].unit === '')
      assert(metrics[0].description === '')
      assert.deepEqual(metrics[0].props, {key: 'value'})
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().getAll()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('getByID', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a metric', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: [{metricID: '1', props: '{"key": "value"}'}]})
      })
      const metrics = await new MetricsStore().getByID('1')
      assert(metrics.length === 1)
      assert(metrics[0].unit === '')
      assert(metrics[0].description === '')
      assert.deepEqual(metrics[0].props, {key: 'value'})
    })

    it('should return NotFoundError if no item exists', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: []})
      })

      let error
      try {
        await new MetricsStore().getByID()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().getByID()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the metric', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          metricID: '1', type: 'type', title: 'title', unit: '', description: '', status: 'status', order: 1
        }})
      })
      const metric = await new MetricsStore().update('1', undefined, undefined, undefined, undefined,
                                                     undefined, undefined, {key: 'value'})
      assert(metric.metricID === '1')
      assert(metric.unit === '')
      assert(metric.description === '')
      assert.deepEqual(metric.props, {key: 'value'})
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().update('1', '', '', '', 1)
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
