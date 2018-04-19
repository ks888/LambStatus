import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchIncidents'
import SNS from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Incident, IncidentUpdate } from 'model/incidents'
import { incidentStatuses } from 'utils/const'
import { NotFoundError } from 'utils/errors'

describe('patchIncidents', () => {
  afterEach(() => {
    IncidentsStore.prototype.get.restore()
    IncidentsStore.prototype.update.restore()
    IncidentUpdatesStore.prototype.create.restore()
    IncidentUpdatesStore.prototype.query.restore()
    SNS.prototype.notifyIncident.restore()
  })

  const generateIncident = (incidentID) => {
    return new Incident({incidentID, name: 'name', status: incidentStatuses[0]})
  }

  const generateIncidentUpdates = ids => {
    return ids.map(id => new IncidentUpdate({incidentUpdateID: id}))
  }

  it('should update the incident', async () => {
    const incident = generateIncident('1')
    sinon.stub(IncidentsStore.prototype, 'get').returns(incident)
    const updateIncidentStub = sinon.stub(IncidentsStore.prototype, 'update').returns()

    const createIncidentUpdateStub = sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    const incidentUpdates = generateIncidentUpdates(['1', '2'])
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns(incidentUpdates)
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    const event = { params: { incidentid: '1' }, body: {name: 'test', status: incidentStatuses[0]} }
    await handle(event, null, (error, result) => {
      assert(error === null)

      assert(result.incidentID !== undefined)
      assert(result.incidentUpdates.length === 2)
      assert(result.incidentUpdates[0].incidentUpdateID !== undefined)
    })
    assert(updateIncidentStub.calledOnce)
    assert(updateIncidentStub.firstCall.args[0] instanceof Incident)

    assert(createIncidentUpdateStub.calledOnce)
    assert(createIncidentUpdateStub.firstCall.args[0] instanceof IncidentUpdate)

    assert(snsStub.calledOnce)
  })

  it('should return validation error if event body is invalid', async () => {
    const incident = generateIncident('1')

    sinon.stub(IncidentsStore.prototype, 'get').returns(incident)
    sinon.stub(IncidentsStore.prototype, 'update').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ params: { incidentid: '1' }, body: { status: '' } }, null, (error, result) => {
      assert(error.match(/invalid/))
    })
  })

  it('should return not found error if id does not exist', async () => {
    sinon.stub(IncidentsStore.prototype, 'get').throws(new NotFoundError())
    sinon.stub(IncidentsStore.prototype, 'update').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ params: { incidentid: '1' }, body: { status: '' } }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentsStore.prototype, 'get').throws()
    sinon.stub(IncidentsStore.prototype, 'update').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'create').returns()
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
