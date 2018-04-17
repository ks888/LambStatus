import SNS from 'aws/sns'
import ComponentsStore from 'db/components'
import { ValidationError } from 'utils/errors'

export default async (event, eventUpdate, eventType, components, eventsStore, eventUpdatesStore) => {
  try {
    event.validateExceptEventID()
    await eventsStore.create(event)

    eventUpdate.setEventID(event.getEventID())
    eventUpdate.validateExceptEventUpdateID()
    await eventUpdatesStore.create(eventUpdate)

    const componentsStore = new ComponentsStore()
    await Promise.all(components.map(async (component) => {
      // TODO: validate
      await componentsStore.updateStatus(component.componentID, component.status)
    }))

    await new SNS().notifyIncident(event.getEventID(), eventType)
  } catch (error) {
    if (error.name === ValidationError.name) {
      throw new Error(error.message)
    }
    throw new Error('failed to create a new event')
  }
}
