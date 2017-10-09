import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchMaintenanceUpdates'
import SNS from 'aws/sns'
import MaintenanceUpdatesStore from 'db/maintenanceUpdates'
import { MaintenanceUpdate } from 'model/maintenances'
import { maintenanceStatuses } from 'utils/const'

describe('patchMaintenanceUpdates', () => {
  const generateParams = () => {
    return {
      params: {maintenanceid: '1', maintenanceupdateid: '1'},
      body: {maintenanceStatus: maintenanceStatuses[0]}
    }
  }

  afterEach(() => {
    MaintenanceUpdatesStore.prototype.update.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should create the maintenance', async () => {
    const updateMaintenanceUpdateStub = sinon.stub(MaintenanceUpdatesStore.prototype, 'update')
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const params = generateParams()
    await handle(params, null, (error, result) => {
      assert(error === null)

      assert(result.maintenanceID !== undefined)
      assert(result.maintenanceUpdateID !== undefined)
    })

    assert(updateMaintenanceUpdateStub.calledOnce)
    assert(updateMaintenanceUpdateStub.firstCall.args[0] instanceof MaintenanceUpdate)
    assert(snsStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(MaintenanceUpdatesStore.prototype, 'update').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const params = generateParams()
    params.body.maintenanceStatus = undefined
    return await handle(params, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(MaintenanceUpdatesStore.prototype, 'update').throws()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const params = generateParams()
    return await handle(params, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
