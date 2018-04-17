import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchMaintenances'
import SNS from 'aws/sns'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { Maintenance, MaintenanceUpdate } from 'model/maintenances'
import { maintenanceStatuses } from 'utils/const'

describe('patchMaintenances', () => {
  afterEach(() => {
    MaintenancesStore.prototype.update.restore()
    MaintenanceUpdatesStore.prototype.create.restore()
    SNS.prototype.notifyIncident.restore()
  })

  const createMaintenanceUpdateMock = maintenanceUpdate => {
    maintenanceUpdate.setEventUpdateID('1')
    return maintenanceUpdate
  }

  it('should update the maintenance', async () => {
    const updateMaintStub = sinon.stub(MaintenancesStore.prototype, 'update').returns()
    const createMaintUpdateStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'create', createMaintenanceUpdateMock)
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const event = {
      params: { maintenanceid: '1' },
      body: {
        name: 'test',
        status: maintenanceStatuses[0],
        startAt: 'Jan 1, 2017, 00:00 UTC',
        endAt: 'Jan 1, 2017, 00:00 UTC'
      }
    }
    await handle(event, null, (error, result) => {
      assert(error === null)

      assert(result.maintenance.maintenanceID === '1')
      assert(result.maintenance.maintenanceUpdateID !== undefined)
      assert(result.maintenance.name === 'test')
    })
    assert(updateMaintStub.calledOnce)
    assert(updateMaintStub.firstCall.args[0] instanceof Maintenance)

    assert(createMaintUpdateStub.calledOnce)
    assert(createMaintUpdateStub.firstCall.args[0] instanceof MaintenanceUpdate)

    assert(snsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenancesStore.prototype, 'update').returns()
    sinon.stub(MaintenanceUpdatesStore.prototype, 'create').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ params: { maintenanceid: '1' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
