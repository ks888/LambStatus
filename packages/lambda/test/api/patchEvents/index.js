import assert from 'assert'
import sinon from 'sinon'
import patchEvents from 'api/patchEvents'
import SNS, { messageType } from 'aws/sns'
import ComponentsStore from 'db/components'
import EventsStore from 'db/events'
import EventUpdatesStore from 'db/eventUpdates'
import { Component } from 'model/components'
import { Event, EventUpdate } from 'model/events'
import { ValidationError } from 'utils/errors'

describe('patchEvents', () => {
  const eventType = messageType.incidentUpdated
  let event, eventUpd, eventUpds, eventsStore, eventUpdatesStore, components, updateStatusStub, snsStub

  beforeEach(() => {
    event = new Event()
    event.validate = sinon.spy()
    event.getEventID = () => {}

    eventsStore = new EventsStore()
    eventsStore.update = sinon.spy()

    eventUpd = new EventUpdate()
    eventUpd.validateExceptEventUpdateID = sinon.spy()
    eventUpds = [new EventUpdate(), new EventUpdate()]

    eventUpdatesStore = new EventUpdatesStore()
    eventUpdatesStore.create = sinon.spy()
    eventUpdatesStore.query = sinon.stub().returns(eventUpds)

    components = []

    updateStatusStub = sinon.stub(ComponentsStore.prototype, 'updateStatus')
    snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()
  })

  afterEach(() => {
    ComponentsStore.prototype.updateStatus.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should update the existing event', async () => {
    await patchEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(event.validate.calledOnce)
    assert(eventsStore.update.calledOnce)
  })

  it('should create a new event update', async () => {
    await patchEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(eventUpd.validateExceptEventUpdateID.calledOnce)
    assert(eventUpdatesStore.create.calledOnce)
  })

  it('should update the status of components', async () => {
    components = [new Component({}), new Component({})]
    await patchEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(components.length === updateStatusStub.callCount)
  })

  it('should notify the update', async () => {
    await patchEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(snsStub.calledOnce)
  })

  it('should return event and event updates', async () => {
    const [
      incident,
      incidentUpdates
    ] = await patchEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(incident === event)
    assert(incidentUpdates === eventUpds)
  })

  it('should handle ValidationError', async () => {
    eventUpd.validateExceptEventUpdateID = () => { throw new ValidationError() }
    let err
    try {
      await patchEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    } catch (e) {
      err = e
    }
    assert(ValidationError.name !== err.name)
  })
})
