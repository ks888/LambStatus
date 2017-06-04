import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMaintenanceUpdates'
import { Maintenances, Maintenance } from 'model/maintenances'

describe('getMaintenanceUpdates', () => {
  afterEach(() => {
    Maintenances.prototype.lookup.restore()
    Maintenance.prototype.getMaintenanceUpdates.restore()
  })

  it('should return a list of maintenance updates', async () => {
    const maintenanceUpdates = [{ maintenanceID: '1', maintenanceUpdateID: '1' }]
    sinon.stub(Maintenance.prototype, 'getMaintenanceUpdates').returns(maintenanceUpdates)
    const maintenance = new Maintenance('1', undefined, undefined, undefined, undefined, undefined, [], '1')
    sinon.stub(Maintenances.prototype, 'lookup').returns(maintenance)

    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error === null)
      assert.deepEqual(result, maintenanceUpdates)
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Maintenance.prototype, 'getMaintenanceUpdates').throws()
    sinon.stub(Maintenances.prototype, 'lookup').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
