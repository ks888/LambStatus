import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/patchIncidents'
import { Incident } from 'model/incidents'
import SNS from 'aws/sns'

describe('patchIncidents', () => {
  afterEach(() => {
    Incident.prototype.validate.restore()
    Incident.prototype.save.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should update the incident', async () => {
    const validateStub = sinon.stub(Incident.prototype, 'validate').returns('')
    const saveStub = sinon.stub(Incident.prototype, 'save').returns()
    const snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()

    await handle({ params: { incidentid: '1' }, body: {name: 'test'} }, null, (error, result) => {
      assert(error === null)
      console.log(result.incident)
      assert(result.incident.incidentID === '1')
      assert(result.incident.name === 'test')
      assert(result.components.length === 0)
    })
    assert(validateStub.calledOnce)
    assert(saveStub.calledOnce)
    assert(snsStub.calledOnce)
  })

  it('should return error on exception thrown', async () => {
    sinon.stub(Incident.prototype, 'validate').throws()
    sinon.stub(Incident.prototype, 'save').returns()
    sinon.stub(SNS.prototype, 'notifyIncident').returns()

    return await handle({ params: { incidentid: '1' } }, null, (error, result) => {
      assert(error.match(/Error/))
    })
  })
})
