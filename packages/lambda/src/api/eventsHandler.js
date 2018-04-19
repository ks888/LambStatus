import SNS from 'aws/sns'
import { NotFoundError, ValidationError } from 'utils/errors'
import ComponentsStore from 'db/components'

export default class EventsHandler {
  constructor (eventsStore, eventUpdatesStore) {
    this.eventsStore = eventsStore
    this.eventUpdatesStore = eventUpdatesStore
  }

  async listEvents () {
    try {
      return await this.eventsStore.query()
    } catch (error) {
      throw new Error('failed to get events list')
    }
  }

  async getEvent (eventID) {
    try {
      const event = await this.eventsStore.get(eventID)
      const eventUpdate = await this.eventUpdatesStore.query(eventID)
      return [event, eventUpdate]
    } catch (error) {
      if (error.name === NotFoundError.name) {
        throw new Error(error.message)
      }
      throw new Error('failed to get an event')
    }
  }

  async createEvent (event, eventUpdate, eventType, components) {
    try {
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

      await new SNS().notifyIncident(event.getEventID(), eventType)

      return [event, eventUpdate]
    } catch (error) {
      if (error.name === ValidationError.name) {
        throw new Error(error.message)
      }
      throw new Error('failed to create a new event')
    }
  }

  async updateEvent (event, eventUpdate, eventType, components) {
    try {
      event.validate()
      await this.eventsStore.update(event)

      eventUpdate.validateExceptEventUpdateID()
      await this.eventUpdatesStore.create(eventUpdate)

      const componentsStore = new ComponentsStore()
      await Promise.all(components.map(async (component) => {
        // TODO: validate
        await componentsStore.updateStatus(component.componentID, component.status)
      }))

      await new SNS().notifyIncident(event.getEventID(), eventType)

      const eventUpdates = await this.eventUpdatesStore.query(event.getEventID())
      return [event, eventUpdates]
    } catch (error) {
      if (error.name === ValidationError.name) {
        throw new Error(error.message)
      }
      throw new Error('failed to update the event')
    }
  }

  async updateEventUpdate (eventUpdate, eventType) {
    try {
      eventUpdate.validate()
      await this.eventUpdatesStore.update(eventUpdate)

      await new SNS().notifyIncident(eventUpdate.getEventID(), eventType)
    } catch (error) {
      if (error.name === ValidationError.name) {
        throw new Error(error.message)
      }
      throw new Error('failed to patch the event update')
    }
  }

  async deleteEvent (eventID, eventType) {
    try {
      if (!await this.exists(eventID)) return

      await this.eventsStore.delete(eventID)
      const eventUpdates = await this.eventUpdatesStore.query(eventID)
      await this.eventUpdatesStore.delete(eventID, eventUpdates.map(upd => upd.getEventUpdateID()))

      await new SNS().notifyIncident(eventID, eventType)
    } catch (error) {
      throw new Error('failed to delete the event')
    }
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
