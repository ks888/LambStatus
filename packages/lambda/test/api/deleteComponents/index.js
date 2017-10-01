import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/deleteComponents'
import ComponentsStore from 'db/components'

describe('deleteComponents', () => {
  afterEach(() => {
    ComponentsStore.prototype.delete.restore()
  })

  it('should delete the component', async () => {
    const deleteComponentStub = sinon.stub(ComponentsStore.prototype, 'delete').returns()

    let err
    await handle({ params: { componentid: '1' } }, null, error => {
      err = error
    })
    assert(err === undefined)
    assert(deleteComponentStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(ComponentsStore.prototype, 'delete').throws()

    let err
    await handle({params: {componentid: '1'}}, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
