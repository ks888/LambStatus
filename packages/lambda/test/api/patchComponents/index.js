import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchComponents'
import ComponentsStore from 'db/components'
import { Component } from 'model/components'
import { componentStatuses } from 'utils/const'
import { NotFoundError } from 'utils/errors'

describe('patchComponents', () => {
  afterEach(() => {
    ComponentsStore.prototype.update.restore()
    ComponentsStore.prototype.get.restore()
  })

  const generateComponent = (componentID) => {
    return new Component({componentID, name: 'name', status: componentStatuses[0]})
  }

  it('should update the component', async () => {
    const componentID = '1'
    const originalComponent = generateComponent(componentID)
    sinon.stub(ComponentsStore.prototype, 'get').returns(originalComponent)
    const updateComponentStub = sinon.stub(ComponentsStore.prototype, 'update').returns()

    const event = { params: { componentid: componentID }, body: {name: 'new name'} }
    await handle(event, null, (error, result) => {
      assert(error === null)
      assert(result.componentID === '1')
      assert(result.name === event.body.name)
      assert(result.status === componentStatuses[0])
    })
    assert(updateComponentStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    const componentID = '1'
    const originalComponent = generateComponent(componentID)
    sinon.stub(ComponentsStore.prototype, 'get').returns(originalComponent)
    sinon.stub(ComponentsStore.prototype, 'update').returns()

    const event = { params: { componentid: componentID }, body: {name: ''} }
    return await handle(event, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return not found error if component id does not exist', async () => {
    sinon.stub(ComponentsStore.prototype, 'get').throws(new NotFoundError())
    sinon.stub(ComponentsStore.prototype, 'update').returns()

    const event = { params: {}, body: {name: ''} }
    return await handle(event, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ComponentsStore.prototype, 'get').throws()
    sinon.stub(ComponentsStore.prototype, 'update').throws()

    return await handle({params: {}}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
