import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchComponents'
import { Component } from 'model/components'

describe('patchComponents', () => {
  afterEach(() => {
    Component.prototype.validate.restore()
    Component.prototype.save.restore()
  })

  it('should update the component', async () => {
    const validateStub = sinon.stub(Component.prototype, 'validate').returns()
    const saveStub = sinon.stub(Component.prototype, 'save').returns()

    // TODO: check merge is successful
    await handle({ params: { componentid: '1' }, body: {name: 'test'} }, null, (error, result) => {
      assert(error === null)
      assert(result.componentID === '1')
      assert(result.name === 'test')
    })
    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Component.prototype, 'validate').throws()
    sinon.stub(Component.prototype, 'save').returns()

    return await handle({ params: { componentid: '1' }, body: {} }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
