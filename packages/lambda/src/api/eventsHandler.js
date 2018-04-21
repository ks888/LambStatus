import SNS from 'aws/sns'
import { NotFoundError } from 'utils/errors'
import ComponentsStore from 'db/components'

export default class EventsHandler {
  constructor (eventsStore, eventUpdatesStore) {
    this.eventsStore = eventsStore
    this.eventUpdatesStore = eventUpdatesStore
  }

  async listEvents () {
    return await this.eventsStore.query()
  }

  async getEvent (eventID) {
    const event = await this.eventsStore.get(eventID)
    const eventUpdate = await this.eventUpdatesStore.query(eventID)
    return [event, eventUpdate]
  }

  async createEvent (event, eventUpdate, eventType, components) {
    event.validateExceptEventID()
    await this.eventsStore.create(event)

    eventUpdate.setEventID(event.getEventID())
    eventUpdate.validateExceptEventUpdateID()
    await this.eventUpdatesStore.create(eventUpdate)

    const componentsStore = new ComponentsStore()
    await Promise.all(components.map(async (component) => {
      // TODO: validate
      await componentsStore.updateStatus(component.componentID, component.status)
    }))

    await new SNS().notifyEvent(event.getEventID(), eventType)

    return [event, eventUpdate]
  }

  async updateEvent (event, eventUpdate, eventType, components) {
    event.validate()
    await this.eventsStore.update(event)

    eventUpdate.validateExceptEventUpdateID()
    await this.eventUpdatesStore.create(eventUpdate)

    const componentsStore = new ComponentsStore()
    await Promise.all(components.map(async (component) => {
      // TODO: validate
      await componentsStore.updateStatus(component.componentID, component.status)
    }))

    await new SNS().notifyEvent(event.getEventID(), eventType)

    const eventUpdates = await this.eventUpdatesStore.query(event.getEventID())
    return [event, eventUpdates]
  }

  async updateEventUpdate (eventUpdate, eventType) {
    eventUpdate.validate()
    await this.eventUpdatesStore.update(eventUpdate)

    await new SNS().notifyEvent(eventUpdate.getEventID(), eventType)
  }

  async deleteEvent (eventID, eventType) {
    if (!await this.exists(eventID)) return

    await this.eventsStore.delete(eventID)
    const eventUpdates = await this.eventUpdatesStore.query(eventID)
    await this.eventUpdatesStore.delete(eventID, eventUpdates.map(upd => upd.getEventUpdateID()))

    await new SNS().notifyEvent(eventID, eventType)
  }

  async exists (eventID) {
    try {
      await this.eventsStore.get(eventID)
      return true
    } catch (error) {
      if (error.name === NotFoundError.name) {
        return false
      }
      throw error
    }
  }
}
