import { NotFoundError } from 'utils/errors'

export default async (eventID, eventsStore, eventUpdatesStore) => {
  try {
    const event = await eventsStore.get(eventID)
    const eventUpdate = await eventUpdatesStore.query(eventID)
    return [event, eventUpdate]
  } catch (error) {
    if (error.name === NotFoundError.name) {
      throw new Error(error.message)
    }
    throw new Error('failed to get an event')
  }
}
