import assert from 'assert'
import getEvents from 'api/getEvents'
import EventsStore from 'db/events'
import { Event } from 'model/events'

describe('getEvents', () => {
  it('should return a list of events', async () => {
    const event = new Event()
    const eventsStore = new EventsStore()
    eventsStore.query = () => { return [event] }

    const actual = await getEvents(eventsStore)
    assert(actual.length === 1)
    assert(event === actual[0])
  })
})
