import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/deleteMaintenances'
import { Maintenances, Maintenance } from 'model/maintenances'

describe('deleteMaintenances', () => {
  afterEach(() => {
    Maintenance.prototype.delete.restore()
    Maintenances.prototype.lookup.restore()
  })

  it('should delete the maintenance', async () => {
    const maint = new Maintenance('1', undefined, undefined, undefined, undefined, undefined, [], '1')
    const lookupStub = sinon.stub(Maintenances.prototype, 'lookup').returns(maint)
    const deleteStub = sinon.stub(Maintenance.prototype, 'delete').returns('')

    await handle({ params: { maintenanceid: '1' } }, null, (error) => {
      assert(error === null)
    })
    assert(lookupStub.calledOnce)
    assert(deleteStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Maintenances.prototype, 'lookup').throws()
    sinon.stub(Maintenance.prototype, 'delete').throws()
    return await handle({ components: [] }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
