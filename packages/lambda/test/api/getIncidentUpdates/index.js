import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/getIncidentUpdates'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { IncidentUpdate } from 'model/incidents'
import { NotFoundError } from 'utils/errors'

describe('getIncidentUpdates', () => {
  afterEach(() => {
    IncidentUpdatesStore.prototype.query.restore()
  })

  it('should return a list of incident updates', async () => {
    const incidentUpdates = [new IncidentUpdate({ incidentID: '1', incidentUpdateID: '1' })]
    sinon.stub(IncidentUpdatesStore.prototype, 'query').returns(incidentUpdates)

    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error === null)
      assert(result.length === 1)
      assert(result[0].incidentID === '1')
      assert(result[0].incidentUpdateID === '1')
    })
  })

  it('should return not found error if the incident does not exist', async () => {
    sinon.stub(IncidentUpdatesStore.prototype, 'query').throws(new NotFoundError())
    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error.match(/not found/))
    })
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(IncidentUpdatesStore.prototype, 'query').throws()
    return await handle({}, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
