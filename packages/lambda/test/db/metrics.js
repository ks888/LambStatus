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
      assert(metrics[0].decimalPlaces === 0)
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
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {metricID: '1', props: '{"key": "value"}'}})
      })
      const metric = await new MetricsStore().getByID('1')
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
        await new MetricsStore().getByID()
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
      const params = {
        metricID: '1',
        type: 'type',
        title: 'title',
        unit: 'unit',
        description: 'description',
        decimalPlaces: 'decimalPlaces',
        status: 'status',
        order: 'order',
        props: {key: 'value'}
      }
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
      const metric = await new MetricsStore().update(params)
      console.log(metric)
      assert(metric.metricID === params.metricID)
      assert.deepEqual(metric.props, params.props)
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new MetricsStore().update('1', undefined, undefined, undefined, undefined,
                                        undefined, undefined, undefined, {key: 'value'})
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
