import ComponentsStore from 'db/components'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Component } from 'model/components'
import generateID from 'utils/generateID'
import { incidentStatuses } from 'utils/const'
import { isValidDate } from 'utils/datetime'
import { ValidationError } from 'utils/errors'

export class Incident {
  constructor ({incidentID, name, status, message = '', components = [], updatedAt = new Date().toISOString()}) {
    if (incidentID === undefined) {
      this.incidentID = generateID()
      this.needIDValidation = false
    } else {
      // If the user specifies the component ID, the ID must be already existed.
      this.incidentID = incidentID
      this.needIDValidation = true
    }
    this.name = name
    this.status = status
    this.message = message
    this.components = components.map(comp => new Component(comp))
    this.updatedAt = updatedAt
  }

  async validate () {
    if (this.incidentID === undefined || this.incidentID === '') {
      throw new ValidationError('invalid incidentID parameter')
    }

    if (this.needIDValidation) {
      const incidents = new Incidents()
      await incidents.lookup(this.incidentID)
    }

    if (this.name === undefined || this.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (incidentStatuses.indexOf(this.status) < 0) {
      throw new ValidationError('invalid incident status parameter')
    }

    if (this.message === undefined) {
      throw new ValidationError('invalid message parameter')
    }

    if (this.components === undefined || !Array.isArray(this.components)) {
      throw new ValidationError('invalid components parameter')
    }

    await Promise.all(this.components.map(async comp => {
      await comp.validate()
    }))

    if (!isValidDate(this.updatedAt)) {
      throw new ValidationError('invalid updatedAt parameter')
    }
  }

  async getIncidentUpdates () {
    const incidentUpdatesStore = new IncidentUpdatesStore()
    return await incidentUpdatesStore.getByIncidentID(this.incidentID)
  }

  async save () {
    // TODO: retry
    const incidentsStore = new IncidentsStore()
    await incidentsStore.update(this.objectify())

    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.update(this.objectify())

    const componentsStore = new ComponentsStore()
    await Promise.all(this.components.map(async (component) => {
      await componentsStore.updateStatus(component.componentID, component.status)
    }))
  }

  async delete () {
    const incidentsStore = new IncidentsStore()
    await incidentsStore.delete(this.incidentID)

    const incidentUpdates = await this.getIncidentUpdates()
    const incidentUpdateIDs = incidentUpdates.map(incidentUpdate => incidentUpdate.incidentUpdateID)
    const incidentUpdatesStore = new IncidentsStore()
    await incidentUpdatesStore.delete(this.incidentID, incidentUpdateIDs)
  }

  objectify () {
    return {
      incidentID: this.incidentID,
      name: this.name,
      status: this.status,
      message: this.message,
      components: this.components.map(comp => { return comp.objectify() }),
      updatedAt: this.updatedAt
    }
  }
}

export class Incidents {
  async all () {
    const store = new IncidentsStore()
    const incidents = await store.getAll()
    return incidents.map(incident => new Incident(incident))
  }

  async lookup (incidentID) {
    const store = new IncidentsStore()
    const incident = await store.getByID(incidentID)
    return new Incident(incident)
  }
}
