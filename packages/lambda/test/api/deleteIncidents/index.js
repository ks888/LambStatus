import assert from 'assert'
import sinon from 'sinon'
import SNS from 'aws/sns'
import { handle } from 'api/deleteIncidents'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Incident, IncidentUpdate } from 'model/incidents'

describe('deleteIncidents', () => {
  afterEach(() => {
    IncidentsStore.prototype.get.restore()
    IncidentsStore.prototype.delete.restore()
    IncidentUpdatesStore.prototype.query.restore()
    IncidentUpdatesStore.prototype.delete.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should delete the incident', async () => {
    const incident = new Incident({incidentID: '1'})
    sinon.stub(IncidentsStore.prototype, 'get').returns(incident)
    const deleteIncidentStub = sinon.stub(IncidentsStore.prototype, 'delete').returns()

    const incidentUpdates = [new IncidentUpdate({incidentID: '1', incidentUpdateID: '1'})]
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns(incidentUpdates)
    const deleteIncidentUpdateStub = sinon.stub(IncidentUpdatesStore.prototype, 'delete').returns()

    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    await handle({ params: { incidentid: '1' } }, null, (error) => {
      assert(error === null)
    })
    assert(deleteIncidentStub.calledOnce)
    assert(deleteIncidentUpdateStub.calledOnce)
    assert(snsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentsStore.prototype, 'get').throws()
    sinon.stub(IncidentsStore.prototype, 'delete').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'delete').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({params: {incidentid: '1'}}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
