import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postMaintenances'
import { Maintenance } from 'model/maintenances'
import SNS from 'aws/sns'

describe('postMaintenances', () => {
  afterEach(() => {
    Maintenance.prototype.validate.restore()
    Maintenance.prototype.save.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should create the maintenance', async () => {
    const validateStub = sinon.stub(Maintenance.prototype, 'validate').returns()
    const saveStub = sinon.stub(Maintenance.prototype, 'save').returns()
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    await handle({ name: 'test' }, null, (error, result) => {
      assert(error === null)
      assert(result.maintenance.maintenanceID.length === 12)
      assert(result.maintenance.name === 'test')
      assert(result.components.length === 0)
    })
    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
    assert(snsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Maintenance.prototype, 'validate').throws()
    sinon.stub(Maintenance.prototype, 'save').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ components: [] }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
