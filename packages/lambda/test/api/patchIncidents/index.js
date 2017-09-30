import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchIncidents'
import SNS from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Incident, IncidentUpdate } from 'model/incidents'
import { incidentStatuses } from 'utils/const'

describe('patchIncidents', () => {
  afterEach(() => {
    IncidentsStore.prototype.update.restore()
    IncidentUpdatesStore.prototype.create.restore()
    SNS.prototype.notifyIncident.restore()
  })

  const createIncidentUpdateMock = incidentUpdate => {
    incidentUpdate.setIncidentUpdateID('1')
    return incidentUpdate
  }

  it('should update the incident', async () => {
    const updateIncidentStub = sinon.stub(IncidentsStore.prototype, 'update').returns()
    const createIncidentUpdateStub = sinon.stub(IncidentUpdatesStore.prototype, 'create', createIncidentUpdateMock)
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const event = { params: { incidentid: '1' }, body: {name: 'test', status: incidentStatuses[0]} }
    await handle(event, null, (error, result) => {
      assert(error === null)

      assert(result.incident.incidentID === '1')
      assert(result.incident.incidentUpdateID !== undefined)
      assert(result.incident.name === 'test')
    })
    assert(updateIncidentStub.calledOnce)
    assert(updateIncidentStub.firstCall.args[0] instanceof Incident)

    assert(createIncidentUpdateStub.calledOnce)
    assert(createIncidentUpdateStub.firstCall.args[0] instanceof IncidentUpdate)

    assert(snsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentsStore.prototype, 'update').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
