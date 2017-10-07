import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import MetricsStore from 'db/metrics'
import { Metric } from 'model/metrics'

describe('MetricsStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a list of metrics', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{metricID: '1', type: 'Mock', props: '{"key": "value"}'}]})
      })
      const metrics = await new MetricsStore().query()
      assert(metrics.length === 1)
      assert(metrics[0] instanceof Metric)
      assert(metrics[0].metricID === '1')
      assert(metrics[0].unit === '')
      assert(metrics[0].description === '')
      assert(metrics[0].decimalPlaces === 0)
      assert.deepEqual(metrics[0].props, {key: 'value'})
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().query()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('get', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a metric', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {metricID: '1', type: 'Mock', props: '{"key": "value"}'}})
      })
      const metric = await new MetricsStore().get('1')
      assert(metric instanceof Metric)
      assert(metric.unit === '')
      assert(metric.description === '')
      assert(metric.decimalPlaces === 0)
      assert.deepEqual(metric.props, {key: 'value'})
    })

    it('should return NotFoundError if no item exists', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {})
      })

      let error
      try {
        await new MetricsStore().get()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().get()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('create', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should generate component id', async () => {
      const store = new MetricsStore()
      store.update = sinon.spy()

      await store.create(new Metric({type: 'Mock'}))
      assert(store.update.calledOnce)
      assert(store.update.firstCall.args[0].metricID.length === 12)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the metric', async () => {
      const params = {
        metricID: '1',
        type: 'Mock',
        title: 'title',
        unit: 'unit',
        description: 'description',
        decimalPlaces: 'decimalPlaces',
        status: 'status',
        order: 'order',
        props: {key: 'value'}
      }
      const metric = new Metric(params)
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {
          metricID: params.Key.metricID,
          type: params.ExpressionAttributeValues[':type'],
          title: params.ExpressionAttributeValues[':title'],
          unit: params.ExpressionAttributeValues[':unit'],
          description: params.ExpressionAttributeValues[':description'],
          decimalPlaces: params.ExpressionAttributeValues[':decimalPlaces'],
          status: params.ExpressionAttributeValues[':status'],
          order: params.ExpressionAttributeValues[':order'],
          props: params.ExpressionAttributeValues[':props']
        }})
      })
      const updatedMetric = await new MetricsStore().update(metric)
      assert(updatedMetric instanceof Metric)
      assert(updatedMetric.metricID === params.metricID)
      assert.deepEqual(updatedMetric.props, params.props)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      const metric = new Metric({metricID: '1', type: 'Mock', props: {key: 'value'}})
      let error
      try {
        await new MetricsStore().update(metric)
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('delete', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should delete the metric', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        assert(params.Key.metricID === '1')
        callback(null)
      })
      await new MetricsStore().delete('1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().delete('1')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
