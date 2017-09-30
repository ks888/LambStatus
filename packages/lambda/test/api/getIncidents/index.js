import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getIncidents'
import IncidentsStore from 'db/incidents'
import { Incident } from 'model/incidents'

describe('getIncidents', () => {
  afterEach(() => {
    IncidentsStore.prototype.query.restore()
  })

  it('should return a list of incidents', async () => {
    const incidents = [new Incident({incidentID: '1'})]
    sinon.stub(IncidentsStore.prototype, 'query').returns(incidents.slice(0))

    return await handle({}, null, (error, result) => {
      assert(error === null)
      assert(result.length === 1)
      assert(result[0].incidentID === '1')
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentsStore.prototype, 'query').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
