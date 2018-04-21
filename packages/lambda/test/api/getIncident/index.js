import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getIncident'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Incident, IncidentUpdate } from 'model/incidents'
import { NotFoundError } from 'utils/errors'

describe('getIncident', () => {
  afterEach(() => {
    IncidentsStore.prototype.get.restore()
    IncidentUpdatesStore.prototype.query.restore()
  })

  it('should return an incident', async () => {
    const incident = new Incident({incidentID: '1'})
    sinon.stub(IncidentsStore.prototype, 'get').returns(incident)
    const incidentUpdates = [new IncidentUpdate({incidentID: '1', incidentUpdateID: '1'})]
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns(incidentUpdates)

    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error === null)
      assert(result.incidentID === '1')
      assert(result.incidentUpdates.length === 1)
      assert(result.incidentUpdates[0].incidentID === '1')
      assert(result.incidentUpdates[0].incidentUpdateID === '1')
    })
  })

  it('should handle not found error', async () => {
    sinon.stub(IncidentsStore.prototype, 'get').throws(new NotFoundError())
    sinon.stub(IncidentUpdatesStore.prototype, 'query').throws()
    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentsStore.prototype, 'get').throws()
    sinon.stub(IncidentUpdatesStore.prototype, 'query').throws()
    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
