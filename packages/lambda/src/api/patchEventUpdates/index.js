import SNS from 'aws/sns'
import { ValidationError } from 'utils/errors'

export default async (eventUpdate, eventType, eventUpdatesStore) => {
  try {
    eventUpdate.validate()
    await eventUpdatesStore.update(eventUpdate)

    await new SNS().notifyIncident(eventUpdate.getEventID(), eventType)
  } catch (error) {
    if (error.name === ValidationError.name) {
      throw new Error(error.message)
    }
    throw new Error('failed to patch the event update')
  }
}
