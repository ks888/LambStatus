import assert from 'assert'
import getEvent from 'api/getEvent'
import EventsStore from 'db/events'
import EventUpdatesStore from 'db/eventUpdates'
import { Event, EventUpdate } from 'model/events'
import { NotFoundError } from 'utils/errors'

describe('getEvent', () => {
  it('should return the existing event', async () => {
    const event = new Event()
    const eventID = 1
    event.id = eventID

    const eventsStore = new EventsStore()
    eventsStore.get = () => { return event }

    const eventUpd = new EventUpdate()
    const eventUpdateID = 2
    eventUpd.id = eventUpdateID

    const eventUpdatesStore = new EventUpdatesStore()
    eventUpdatesStore.query = () => { return [eventUpd] }

    const actual = await getEvent(eventID, eventsStore, eventUpdatesStore)
    assert(actual.length === 2)
    assert(actual[0].id === eventID)
    assert(actual[1].length === 1)
    assert(actual[1][0].id === eventUpdateID)
  })

  it('should handle NotFoundError', async () => {
    const eventsStore = new EventsStore()
    eventsStore.get = () => { throw new NotFoundError() }

    let err
    try {
      await getEvent(null, eventsStore, null)
    } catch (e) {
      err = e
    }
    assert(err.name !== NotFoundError.name)
  })
})
