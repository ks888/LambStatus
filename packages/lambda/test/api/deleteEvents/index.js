import assert from 'assert'
import sinon from 'sinon'
import SNS, { messageType } from 'aws/sns'
import deleteEvents from 'api/deleteEvents'
import EventsStore from 'db/events'
import EventUpdatesStore from 'db/eventUpdates'
import { Event, EventUpdate } from 'model/events'
import { NotFoundError } from 'utils/errors'

describe('deleteEvents', () => {
  const eventType = messageType.incidentDeleted
  let event, eventUpds, eventsStore, eventUpdatesStore, snsStub

  beforeEach(() => {
    event = new Event()
    event.validate = sinon.spy()
    event.getEventID = () => {}

    eventsStore = new EventsStore()
    eventsStore.get = sinon.stub().returns(event)
    eventsStore.delete = sinon.spy()

    eventUpds = [new EventUpdate(), new EventUpdate()]
    eventUpds.forEach(eventUpd => { eventUpd.getEventUpdateID = () => {} })

    eventUpdatesStore = new EventUpdatesStore()
    eventUpdatesStore.query = sinon.stub().returns(eventUpds)
    eventUpdatesStore.delete = sinon.spy()

    snsStub = sinon.stub(SNS.prototype, 'notifyIncident').returns()
  })

  afterEach(() => {
    SNS.prototype.notifyIncident.restore()
  })

  it('should delete the event', async () => {
    await deleteEvents(event, eventType, eventsStore, eventUpdatesStore)
    assert(eventsStore.get.calledOnce)
    assert(eventsStore.delete.calledOnce)
  })

  it('should delete the event updates', async () => {
    await deleteEvents(event, eventType, eventsStore, eventUpdatesStore)
    assert(eventUpdatesStore.query.calledOnce)
    assert(eventUpdatesStore.delete.calledOnce)
    const eventUpdateIDs = eventUpdatesStore.delete.firstCall.args[1]
    assert(eventUpdateIDs.length === eventUpds.length)
  })

  it('should notify the event', async () => {
    await deleteEvents(event, eventType, eventsStore, eventUpdatesStore)
    assert(snsStub.calledOnce)
  })

  it('should do nothing if the event does not exist', async () => {
    eventsStore.get = () => { throw new NotFoundError() }
    let err
    try {
      await deleteEvents(event, eventType, eventsStore, eventUpdatesStore)
    } catch (e) {
      err = e
    }
    assert(err === undefined)
    assert(eventsStore.delete.notCalled)
  })
})
