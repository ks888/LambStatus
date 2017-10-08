import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchIncidentUpdates'
import SNS from 'aws/sns'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { IncidentUpdate } from 'model/incidents'
import { incidentStatuses } from 'utils/const'

describe('patchIncidentUpdates', () => {
  const generateParams = () => {
    return {params: {incidentid: '1', incidentupdateid: '1'}, body: {status: incidentStatuses[0]}}
  }

  afterEach(() => {
    IncidentUpdatesStore.prototype.update.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should create the incident', async () => {
    const updateIncidentUpdateStub = sinon.stub(IncidentUpdatesStore.prototype, 'update')
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const params = generateParams()
    await handle(params, null, (error, result) => {
      assert(error === null)

      assert(result.incidentID !== undefined)
      assert(result.incidentUpdateID !== undefined)
    })

    assert(updateIncidentUpdateStub.calledOnce)
    assert(updateIncidentUpdateStub.firstCall.args[0] instanceof IncidentUpdate)
    assert(snsStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(IncidentUpdatesStore.prototype, 'update').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const params = generateParams()
    params.body.status = undefined
    return await handle(params, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentUpdatesStore.prototype, 'update').throws()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const params = generateParams()
    return await handle(params, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
