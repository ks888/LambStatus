import assert from 'assert'
import AWS from 'aws-sdk-mock'
import ComponentsStore from 'db/components'

describe('ComponentsStore', () => {
  describe('getAll', () => {
    afterEach(() => {
      AWS.restore('DynamoDB.DocumentClient')
    })

    it('should return a list of components', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback(null, {Items: [{componentID: '1', name: '', description: '', status: '', order: 1}]})
      })
      const comps = await new ComponentsStore().getAll()
      assert(comps.length === 1)
      assert(comps[0].componentID === '1')
      assert(comps[0].description === '')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().getAll()
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

    it('should return a component', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback(null, {Items: [{componentID: '1', name: '', description: '', status: '', order: 1}]})
      })
      const comps = await new ComponentsStore().getByID('1')
      assert(comps.length === 1)
      assert(comps[0].componentID === '1')
      assert(comps[0].description === '')
    })

    it('should call reject on error', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
        callback('Error')
      })

      let error
      try {
        await new ComponentsStore().getByID()
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

    it('should update the component', async () => {
      AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
        callback(null, {Attributes: {componentID: '1'}})
      })
      const comp = await new ComponentsStore().update({componentID: '1', description: ''})
      assert(comp.componentID === '1')
      assert(comp.description === '')
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
})
