import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getComponents'
import { Component } from 'model/components'
import ComponentsStore from 'db/components'

describe('getComponents', () => {
  afterEach(() => {
    ComponentsStore.prototype.query.restore()
  })

  it('should return a list of components', async () => {
    const components = [
      new Component({componentID: '2', order: 2}),
      new Component({componentID: '1', order: 1})
    ]
    sinon.stub(ComponentsStore.prototype, 'query').returns(components.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result.length === 2)
      assert(result[0].componentID === '1')
      assert(result[1].componentID === '2')
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ComponentsStore.prototype, 'query').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
