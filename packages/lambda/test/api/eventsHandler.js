import assert from 'assert'
import sinon from 'sinon'
import EventsHandler from 'api/eventsHandler'
import SNS, { messageType } from 'aws/sns'
import ComponentsStore from 'db/components'
import EventsStore from 'db/events'
import EventUpdatesStore from 'db/eventUpdates'
import { Component } from 'model/components'
import { Event, EventUpdate } from 'model/events'
import { NotFoundError, ValidationError } from 'utils/errors'

describe('EventsHandler', () => {
  let eventID, eventUpdateID, event, eventUpd, eventUpds, components, handler
  let eventsStore, eventUpdatesStore
  let updateStatusStub, snsStub

  beforeEach(() => {
    eventID = 1
    event = new Event()
    event.validateExceptEventID = sinon.spy()
    event.validate = sinon.spy()
    event.getEventID = () => eventID

    eventUpdateID = 2
    eventUpds = [new EventUpdate(), new EventUpdate()]
    eventUpds.forEach(upd => {
      upd.setEventID = function (eventID) { this.eventID = eventID }
      upd.getEventID = function () { return this.eventID }
      upd.getEventUpdateID = function () { return this.eventUpdateID }
      upd.validateExceptEventUpdateID = sinon.spy()
      upd.validate = sinon.spy()
    })
    eventUpd = eventUpds[0]

    components = []

    eventsStore = new EventsStore()
    eventsStore.query = () => { return [event] }
    eventsStore.get = sinon.stub().returns(event)
    eventsStore.create = sinon.spy()
    eventsStore.update = sinon.spy()
    eventsStore.delete = sinon.spy()

    eventUpdatesStore = new EventUpdatesStore()
    eventUpdatesStore.query = sinon.stub().returns(eventUpds)
    eventUpdatesStore.create = sinon.spy()
    eventUpdatesStore.update = sinon.spy()
    eventUpdatesStore.delete = sinon.spy()

    updateStatusStub = sinon.stub(ComponentsStore.prototype, 'updateStatus')

    handler = new EventsHandler(eventsStore, eventUpdatesStore)

    snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()
  })

  afterEach(() => {
    ComponentsStore.prototype.updateStatus.restore()
    SNS.prototype.notifyIncident.restore()
  })

  describe('listEvents', () => {
    it('should return a list of events', async () => {
      const actual = await handler.listEvents()
      assert(actual.length === 1)
      assert(event === actual[0])
    })
  })

  describe('getEvent', () => {
    it('should return the existing event', async () => {
      eventUpds.forEach(upd => { upd.eventUpdateID = eventUpdateID })

      const actual = await handler.getEvent(eventID)
      assert(actual.length === 2)
      assert(actual[0].getEventID() === eventID)
      assert(actual[1].length === eventUpds.length)
      assert(actual[1][0].getEventUpdateID() === eventUpdateID)
    })

    it('should handle NotFoundError', async () => {
      eventsStore.get = () => { throw new NotFoundError() }

      let err
      try {
        await handler.getEvent(null)
      } catch (e) {
        err = e
      }
      assert(err.name !== NotFoundError.name)
    })
  })

  describe('createEvent', () => {
    const eventType = messageType.incidentCreated

    it('should create a new event', async () => {
      await handler.createEvent(event, eventUpd, eventType, components)
      assert(eventsStore.create.calledOnce)
    })

    it('should create a new event update', async () => {
      await handler.createEvent(event, eventUpd, eventType, components)
      assert(eventUpdatesStore.create.calledOnce)
    })

    it('should set a event id to event update', async () => {
      await handler.createEvent(event, eventUpd, eventType, components)
      assert(eventUpd.eventID === eventID)
    })

    it('should update component\'s statuses', async () => {
      components = [new Component({}), new Component({})]
      await handler.createEvent(event, eventUpd, eventType, components)
      assert(components.length === updateStatusStub.callCount)
    })

    it('should notify incident', async () => {
      await handler.createEvent(event, eventUpd, eventType, components)
      assert(snsStub.calledOnce)
    })

    it('should return event and event update', async () => {
      const [
        incident,
        incidentUpdate
      ] = await handler.createEvent(event, eventUpd, eventType, components)
      assert(incident === event)
      assert(incidentUpdate === eventUpd)
    })

    it('should handle ValidationError', async () => {
      event.validateExceptEventID = () => { throw new ValidationError() }
      let err
      try {
        await handler.createEvent(event, eventUpd, eventType, components)
      } catch (e) {
        err = e
      }
      assert(ValidationError.name !== err.name)
    })
  })

  describe('updateEvent', () => {
    const eventType = messageType.incidentUpdated

    it('should update the existing event', async () => {
      eventUpds.forEach(upd => { upd.eventUpdateID = eventUpdateID })

      await handler.updateEvent(event, eventUpd, eventType, components)
      assert(event.validate.calledOnce)
      assert(eventsStore.update.calledOnce)
    })

    it('should create a new event update', async () => {
      await handler.updateEvent(event, eventUpd, eventType, components)
      assert(eventUpd.validateExceptEventUpdateID.calledOnce)
      assert(eventUpdatesStore.create.calledOnce)
    })

    it('should update the status of components', async () => {
      components = [new Component({}), new Component({})]
      await handler.updateEvent(event, eventUpd, eventType, components)
      assert(components.length === updateStatusStub.callCount)
    })

    it('should notify the update', async () => {
      await handler.updateEvent(event, eventUpd, eventType, components)
      assert(snsStub.calledOnce)
    })

    it('should return event and event updates', async () => {
      const [
        incident,
        incidentUpdates
      ] = await handler.updateEvent(event, eventUpd, eventType, components)
      assert(incident === event)
      assert(incidentUpdates === eventUpds)
    })

    it('should handle ValidationError', async () => {
      eventUpd.validateExceptEventUpdateID = () => { throw new ValidationError() }
      let err
      try {
        await handler.updateEvent(event, eventUpd, eventType, components)
      } catch (e) {
        err = e
      }
      assert(ValidationError.name !== err.name)
    })
  })

  describe('updateEventUpdate', () => {
    const eventType = messageType.incidentPatched

    it('should update the existing event', async () => {
      await handler.updateEventUpdate(eventUpd, eventType)
      assert(eventUpd.validate.calledOnce)
      assert(eventUpdatesStore.update.calledOnce)
    })

    it('should notify the update', async () => {
      await handler.updateEventUpdate(eventUpd, eventType)
      assert(snsStub.calledOnce)
    })

    it('should handle ValidationError', async () => {
      eventUpd.validate = () => { throw new ValidationError() }
      let err
      try {
        await handler.updateEventUpdate(eventUpd, eventType)
      } catch (e) {
        err = e
      }
      assert(ValidationError.name !== err.name)
    })
  })

  describe('deleteEvent', () => {
    const eventType = messageType.incidentDeleted

    it('should delete the event', async () => {
      await handler.deleteEvent(eventID, eventType)
      assert(eventsStore.get.calledOnce)
      assert(eventsStore.delete.calledOnce)
    })

    it('should delete the event updates', async () => {
      await handler.deleteEvent(eventID, eventType)
      assert(eventUpdatesStore.query.calledOnce)
      assert(eventUpdatesStore.delete.calledOnce)
      const eventUpdateIDs = eventUpdatesStore.delete.firstCall.args[1]
      assert(eventUpdateIDs.length === eventUpds.length)
    })

    it('should notify the event', async () => {
      await handler.deleteEvent(eventID, eventType)
      assert(snsStub.calledOnce)
    })

    it('should do nothing if the event does not exist', async () => {
      eventsStore.get = () => { throw new NotFoundError() }
      let err
      try {
        await handler.deleteEvent(eventID, eventType)
      } catch (e) {
        err = e
      }
      assert(err === undefined)
      assert(eventsStore.delete.notCalled)
    })
  })
})
