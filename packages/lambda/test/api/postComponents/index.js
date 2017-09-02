import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postComponents'
import { Component } from 'model/components'

describe('postComponents', () => {
  afterEach(() => {
    Component.prototype.validate.restore()
    Component.prototype.save.restore()
  })

  it('should update the component', async () => {
    const validateStub = sinon.stub(Component.prototype, 'validate').returns()
    const saveStub = sinon.stub(Component.prototype, 'save').returns()

    await handle({ name: 'test' }, null, (error, result) => {
      assert(error === null)
      assert(result.componentID.length === 12)
      assert(result.name === 'test')
    })

    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Component.prototype, 'validate').throws()
    sinon.stub(Component.prototype, 'save').returns()

    return await handle({ components: [] }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
