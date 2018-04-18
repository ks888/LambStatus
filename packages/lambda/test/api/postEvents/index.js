import assert from 'assert'
import sinon from 'sinon'
import postEvents from 'api/postEvents'
import SNS, { messageType } from 'aws/sns'
import ComponentsStore from 'db/components'
import EventsStore from 'db/events'
import EventUpdatesStore from 'db/eventUpdates'
import { Component } from 'model/components'
import { Event, EventUpdate } from 'model/events'
import { ValidationError } from 'utils/errors'

describe('postEvents', () => {
  const eventID = 1
  const eventType = messageType.incidentCreated
  let event, eventUpd, eventsStore, eventUpdatesStore, components, updateStatusStub, snsStub

  beforeEach(() => {
    event = new Event()
    event.validateExceptEventID = () => {}
    event.getEventID = () => eventID

    eventsStore = new EventsStore()
    eventsStore.create = sinon.spy()

    eventUpd = new EventUpdate()
    eventUpd.validateExceptEventUpdateID = () => {}
    eventUpd.setEventID = function (eventID) { this.eventID = eventID }

    eventUpdatesStore = new EventUpdatesStore()
    eventUpdatesStore.create = sinon.spy()

    components = []

    updateStatusStub = sinon.stub(ComponentsStore.prototype, 'updateStatus')
    snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()
  })

  afterEach(() => {
    ComponentsStore.prototype.updateStatus.restore()
    SNS.prototype.notifyIncident.restore()
  })

  it('should create a new event', async () => {
    await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(eventsStore.create.calledOnce)
  })

  it('should create a new event update', async () => {
    await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(eventUpdatesStore.create.calledOnce)
  })

  it('should set a event id to event update', async () => {
    await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(eventUpd.eventID === eventID)
  })

  it('should update component\'s statuses', async () => {
    components = [new Component({}), new Component({})]
    await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(components.length === updateStatusStub.callCount)
  })

  it('should notify incident', async () => {
    await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(snsStub.calledOnce)
  })

  it('should return event and event update', async () => {
    const [
      incident,
      incidentUpdate
    ] = await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    assert(incident === event)
    assert(incidentUpdate === eventUpd)
  })

  it('should handle ValidationError', async () => {
    event.validateExceptEventID = () => { throw new ValidationError() }
    let err
    try {
      await postEvents(event, eventUpd, eventType, components, eventsStore, eventUpdatesStore)
    } catch (e) {
      err = e
    }
    assert(ValidationError.name !== err.name)
  })
})
