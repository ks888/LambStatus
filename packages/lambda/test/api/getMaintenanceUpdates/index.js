import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMaintenanceUpdates'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { MaintenanceUpdate } from 'model/maintenances'
import { NotFoundError } from 'utils/errors'

describe('getMaintenanceUpdates', () => {
  afterEach(() => {
    MaintenanceUpdatesStore.prototype.query.restore()
  })

  it('should return a list of maintenance updates', async () => {
    const maintenanceUpdates = [new MaintenanceUpdate({ maintenanceID: '1', maintenanceUpdateID: '1' })]
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').returns(maintenanceUpdates)

    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error === null)
      assert(result.length === 1)
      assert(result[0].maintenanceID === '1')
      assert(result[0].maintenanceUpdateID === '1')
    })
  })

  it('should return not found error if the maintenance does not exist', async () => {
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').throws(new NotFoundError())
    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
