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
      new Component({componentID: '2', order: 2}),
      new Component({componentID: '1', order: 1})
    ]
    sinon.stub(Components.prototype, 'all').returns(components.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert.deepEqual(result, [components[1].objectify(), components[0].objectify()])
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Components.prototype, 'all').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
