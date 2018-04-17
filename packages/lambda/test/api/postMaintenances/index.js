import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postMaintenances'
import SNS from 'aws/sns'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { Maintenance, MaintenanceUpdate } from 'model/maintenances'
import { maintenanceStatuses } from 'utils/const'

describe('postMaintenances', () => {
  afterEach(() => {
    MaintenancesStore.prototype.create.restore()
    MaintenanceUpdatesStore.prototype.create.restore()
    SNS.prototype.notifyIncident.restore()
  })

  const createMaintenanceMock = maintenance => {
    maintenance.setEventID('1')
    return maintenance
  }

  const createMaintenanceUpdateMock = maintenanceUpdate => {
    maintenanceUpdate.setEventUpdateID('1')
    return maintenanceUpdate
  }

  it('should create the maintenance', async () => {
    const createMaintStub = sinon.stub(MaintenancesStore.prototype, 'create', createMaintenanceMock)
    const createMaintUpdateStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'create', createMaintenanceUpdateMock)
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const event = {
      name: 'test',
      status: maintenanceStatuses[0],
      startAt: 'Jan 1, 2017, 00:00 UTC',
      endAt: 'Jan 1, 2017, 00:00 UTC'
    }
    await handle(event, null, (error, result) => {
      assert(error === null)

      assert(result.maintenance.maintenanceID !== undefined)
      assert(result.maintenance.maintenanceUpdateID !== undefined)
    })
    assert(createMaintStub.calledOnce)
    assert(createMaintStub.firstCall.args[0] instanceof Maintenance)

    assert(createMaintUpdateStub.calledOnce)
    assert(createMaintUpdateStub.firstCall.args[0] instanceof MaintenanceUpdate)

    assert(snsStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(MaintenancesStore.prototype, 'create').returns()
    sinon.stub(MaintenanceUpdatesStore.prototype, 'create').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({}, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenancesStore.prototype, 'create').throws()
    sinon.stub(MaintenanceUpdatesStore.prototype, 'create').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
