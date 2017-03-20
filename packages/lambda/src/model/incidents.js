import ComponentsStore from 'db/components'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Component } from 'model/components'
import generateID from 'utils/generateID'
import { incidentStatuses } from 'utils/const'
import { NotFoundError, ValidationError } from 'utils/errors'

export class Incident {
  constructor (incidentID, name, status, message, components, updatedAt) {
    if (!incidentID) {
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
    this.components = components.map(comp => {
      return new Component(comp.componentID, comp.name, comp.description, comp.status, comp.order)
    })
    if (!updatedAt) {
      this.updatedAt = new Date().toISOString()
    } else {
      this.updatedAt = updatedAt
    }
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

    this.components.forEach(comp => {
      comp.validate()
    })
  }

  async getIncidentUpdates () {
    const incidentUpdatesStore = new IncidentUpdatesStore()
    return await incidentUpdatesStore.getByIncidentID(this.incidentID)
  }

  async save () {
    // TODO: retry
    const incidentsStore = new IncidentsStore()
    await incidentsStore.update(this.incidentID, this.name, this.status, this.updatedAt, false)

    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.update(this.incidentID, this.status, this.message, this.updatedAt)

    const componentsStore = new ComponentsStore()
    await Promise.all(this.components.map(async (component) => {
      await componentsStore.updateStatus(component.componentID, component.status)
    }))
  }

  async delete () {
    const store = new IncidentsStore()
    await store.delete(this.incidentID)
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
    return incidents.map(incident => {
      return new Incident(incident.incidentID, incident.name, incident.status, '', [],
                          incident.updatedAt)
    })
  }

  async lookup (incidentID) {
    const store = new IncidentsStore()
    const incidents = await store.getByID(incidentID)
    if (incidents.length === 0) {
      throw new NotFoundError('no matched item')
    } else if (incidents.length === 1) {
      const incident = incidents[0]
      return new Incident(incident.incidentID, incident.name, incident.status, '', [],
                          incident.updatedAt)
    } else {
      throw new Error('matched too many items')
    }
  }
}
