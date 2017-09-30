import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import { Component } from 'model/components'
import ComponentsStore from 'db/components'

describe('ComponentsStore', () => {
  describe('query', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should query components', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{componentID: '1'}]})
      })
      const comps = await new ComponentsStore().query()
      assert(comps.length === 1)
      assert(comps[0] instanceof Component)
      assert(comps[0].componentID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().query()
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

    it('should return a component', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {Item: {componentID: '1'}})
      })
      const comp = await new ComponentsStore().get('1')
      assert(comp instanceof Component)
      assert(comp.componentID === '1')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().get()
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })

    it('should throw NotFoundError if there is no item', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
        callback(null, {})
      })

      let error
      try {
        await new ComponentsStore().get()
      } catch (e) {
        error = e
      }
      assert(error.name === 'NotFoundError')
    })
  })

  describe('create', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should generate component id', async () => {
      const store = new ComponentsStore()
      store.update = sinon.spy()

      await store.create(new Component({}))
      assert(store.update.calledOnce)
      assert(store.update.firstCall.args[0].componentID.length === 12)
    })
  })

  describe('update', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the component', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {componentID: params.Key.componentID}})
      })
      const comp = await new ComponentsStore().update(new Component({componentID: '1'}))
      assert(comp instanceof Component)
      assert(comp.componentID === '1')
    })

    it('should throw exception if the update failed', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().update({componentID: '1'})
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })

  describe('updateStatus', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should update the component status', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {componentID: params.Key.componentID}})
      })
      const comp = await new ComponentsStore().updateStatus('1', 'test')
      assert(comp instanceof Component)
      assert(comp.componentID === '1')
    })

    it('should throw exception if the update failed', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().updateStatus('1', 'test')
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

    it('should delete the component', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        assert(params.Key.componentID === '1')
        callback(null)
      })
      await new ComponentsStore().delete('1')
    })

    it('should return error on exception thrown', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().delete('1')
      } catch (e) {
        error = e
      }
      assert(error.message.match(/Error/))
    })
  })
})
