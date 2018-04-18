import assert from 'assert'
import sinon from 'sinon'
import patchEventUpdates from 'api/patchEventUpdates'
import SNS, { messageType } from 'aws/sns'
import EventUpdatesStore from 'db/eventUpdates'
import { EventUpdate } from 'model/events'
import { ValidationError } from 'utils/errors'

describe('patchEvents', () => {
  const eventType = messageType.incidentUpdated
  let eventUpd, eventUpdatesStore, snsStub

  beforeEach(() => {
    eventUpd = new EventUpdate()
    eventUpd.validate = sinon.spy()
    eventUpd.getEventID = () => {}

    eventUpdatesStore = new EventUpdatesStore()
    eventUpdatesStore.update = sinon.spy()

    snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()
  })

  afterEach(() => {
    SNS.prototype.notifyIncident.restore()
  })

  it('should update the existing event', async () => {
    await patchEventUpdates(eventUpd, eventType, eventUpdatesStore)
    assert(eventUpd.validate.calledOnce)
    assert(eventUpdatesStore.update.calledOnce)
  })

  it('should notify the update', async () => {
    await patchEventUpdates(eventUpd, eventType, eventUpdatesStore)
    assert(snsStub.calledOnce)
  })

  it('should handle ValidationError', async () => {
    eventUpd.validate = () => { throw new ValidationError() }
    let err
    try {
      await patchEventUpdates(eventUpd, eventType, eventUpdatesStore)
    } catch (e) {
      err = e
    }
    assert(ValidationError.name !== err.name)
  })
})
