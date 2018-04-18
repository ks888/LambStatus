import SNS from 'aws/sns'
import { NotFoundError } from 'utils/errors'

export default async (eventID, eventType, eventsStore, eventUpdatesStore) => {
  try {
    if (!await exists(eventsStore, eventID)) return

    await eventsStore.delete(eventID)
    const eventUpdates = await eventUpdatesStore.query(eventID)
    await eventUpdatesStore.delete(eventID, eventUpdates.map(upd => upd.getEventUpdateID()))

    await new SNS().notifyIncident(eventID, eventType)
  } catch (error) {
    throw new Error('failed to delete the event')
  }
}

const exists = async (eventsStore, eventID) => {
  try {
    await eventsStore.get(eventID)
    return true
  } catch (error) {
    if (error.name === NotFoundError.name) {
      return false
    }
    throw error
  }
}
