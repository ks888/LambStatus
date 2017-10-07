import assert from 'assert'
import sinon from 'sinon'
import SNS from 'aws/sns'
import { handle } from 'api/deleteMaintenances'
import MaintenancesStore from 'db/maintenances'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { Maintenance, MaintenanceUpdate } from 'model/maintenances'

describe('deleteMaintenances', () => {
  afterEach(() => {
    MaintenancesStore.prototype.get.restore()
    MaintenancesStore.prototype.delete.restore()
    MaintenanceUpdatesStore.prototype.query.restore()
    MaintenanceUpdatesStore.prototype.delete.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should delete the maintenance', async () => {
    const maintenance = new Maintenance({maintenanceID: '1'})
    sinon.stub(MaintenancesStore.prototype, 'get').returns(maintenance)
    const deleteMaintenanceStub = sinon.stub(MaintenancesStore.prototype, 'delete').returns()

    const maintenanceUpdates = [new MaintenanceUpdate({maintenanceID: '1', maintenanceUpdateID: '1'})]
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').returns(maintenanceUpdates)
    const deleteMaintenanceUpdateStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'delete').returns()

    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    let err
    await handle({ params: { maintenanceid: '1' } }, null, (error) => {
      err = error
    })
    assert(err === undefined)
    assert(deleteMaintenanceStub.calledOnce)
    assert(deleteMaintenanceUpdateStub.calledOnce)
    assert(snsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenancesStore.prototype, 'get').throws()
    sinon.stub(MaintenancesStore.prototype, 'delete').returns()
    sinon.stub(MaintenanceUpdatesStore.prototype, 'query').returns()
    sinon.stub(MaintenanceUpdatesStore.prototype, 'delete').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    let err
    await handle({params: {maintenanceid: '1'}}, null, (error, result) => {
      err = error
    })
    assert(err.match(/Error/))
  })
})
