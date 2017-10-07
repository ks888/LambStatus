import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getMaintenances'
import MaintenancesStore from 'db/maintenances'
import { Maintenance } from 'model/maintenances'

describe('getMaintenances', () => {
  afterEach(() => {
    MaintenancesStore.prototype.query.restore()
  })

  it('should return a list of maintenances', async () => {
    const maintenances = [new Maintenance({maintenanceID: '1'})]
    sinon.stub(MaintenancesStore.prototype, 'query').returns(maintenances.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result.length === 1)
      assert(result[0].maintenanceID === '1')
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenancesStore.prototype, 'query').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
