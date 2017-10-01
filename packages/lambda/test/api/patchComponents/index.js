import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchComponents'
import ComponentsStore from 'db/components'
import { componentStatuses } from 'utils/const'

describe('patchComponents', () => {
  afterEach(() => {
    ComponentsStore.prototype.update.restore()
  })

  const generateEvent = () => {
    return { params: { componentid: '1' }, body: {name: 'test', status: componentStatuses[0]} }
  }

  it('should update the component', async () => {
    const updateComponentStub = sinon.stub(ComponentsStore.prototype, 'update').returns()

    const event = generateEvent()
    await handle(event, null, (error, result) => {
      assert(error === null)
      assert(result.componentID === '1')
    })
    assert(updateComponentStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(ComponentsStore.prototype, 'update').returns()

    const event = generateEvent()
    event.body.name = undefined
    return await handle(event, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ComponentsStore.prototype, 'update').throws()

    const event = generateEvent()
    return await handle(event, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
