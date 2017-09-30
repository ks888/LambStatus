import assert from 'assert'
import sinon from 'sinon'
import { updateComponentStatus } from 'api/utils'
import ComponentsStore from 'db/components'

describe('updateComponentStatus', () => {
  it('should call updateStatus', () => {
    const updateStatusStub = sinon.stub(ComponentsStore.prototype, 'updateStatus').returns()

    updateComponentStatus({componentID: '1', status: 'test'})
    assert(updateStatusStub.calledOnce)

    ComponentsStore.prototype.updateStatus.restore()
  })
})
