import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getComponents'
import { Components, Component } from 'model/components'

describe('getComponents', () => {
  afterEach(() => {
    Components.prototype.all.restore()
  })

  it('should return a list of components', async () => {
    const components = [
      new Component('2', undefined, undefined, undefined, 2),
      new Component('1', undefined, undefined, undefined, 1)
    ]
    sinon.stub(Components.prototype, 'all').returns(components)

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result === JSON.stringify([{componentID: '1', order: 1}, {componentID: '2', order: 2}]))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Components.prototype, 'all').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
