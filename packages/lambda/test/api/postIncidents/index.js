import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/postIncidents'
import SNS from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Incident, IncidentUpdate } from 'model/incidents'
import { incidentStatuses } from 'utils/const'

describe('postIncidents', () => {
  afterEach(() => {
    IncidentsStore.prototype.create.restore()
    IncidentUpdatesStore.prototype.create.restore()
    SNS.prototype.notifyIncident.restore()
  })

  const createIncidentMock = incident => {
    incident.setIncidentID('1')
    return incident
  }

  const createIncidentUpdateMock = incidentUpdate => {
    incidentUpdate.setIncidentUpdateID('1')
    return incidentUpdate
  }

  it('should create the incident', async () => {
    const createIncidentStub = sinon.stub(IncidentsStore.prototype, 'create', createIncidentMock)
    const createIncidentUpdateStub = sinon.stub(IncidentUpdatesStore.prototype, 'create', createIncidentUpdateMock)
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    await handle({ name: 'test', status: incidentStatuses[0] }, null, (error, result) => {
      assert(error === null)

      assert(result.incidentID !== undefined)
      assert(result.incidentUpdates.length === 1)
      assert(result.incidentUpdates[0].incidentUpdateID !== undefined)
    })
    assert(createIncidentStub.calledOnce)
    assert(createIncidentStub.firstCall.args[0] instanceof Incident)

    assert(createIncidentUpdateStub.calledOnce)
    assert(createIncidentUpdateStub.firstCall.args[0] instanceof IncidentUpdate)

    assert(snsStub.calledOnce)
  })

  it('should return validation error if event is invalid', async () => {
    sinon.stub(IncidentsStore.prototype, 'create').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({}, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentsStore.prototype, 'create').throws()
    sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
