import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postComponents'
import ComponentsStore from 'db/components'
import { componentStatuses } from 'utils/const'

describe('postComponents', () => {
  afterEach(() => {
    ComponentsStore.prototype.create.restore()
  })

  const generateEvent = () => {
    return {name: 'test', status: componentStatuses[0]}
  }

  it('should create a component', async () => {
    const createComponentStub = sinon.stub(ComponentsStore.prototype, 'create').returns()

    const event = generateEvent()
    await handle(event, null, (error, result) => {
      assert(error === null)
      assert(result.name === 'test')
    })

    assert(createComponentStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(ComponentsStore.prototype, 'create').returns()

    const event = generateEvent()
    event.name = undefined
    return await handle(event, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ComponentsStore.prototype, 'create').throws()

    const event = generateEvent()
    return await handle(event, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
