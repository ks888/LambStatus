import { getIncidents, getIncident, updateIncident, deleteIncident } from 'db/incident'
import { getComponent, updateComponentStatus } from 'db/component'
import { getIncidentUpdates, updateIncidentUpdate, deleteIncidentUpdates } from 'db/incidentUpdate'
import generateID from 'utils/generateID'
import { componentStatuses, incidentStatuses } from 'utils/const'
import { ParameterError } from 'utils/errors'

export default class IncidentService {
  async getIncidents () {
    return await getIncidents()
  }

  async getIncidentUpdates (incidentID) {
    if (incidentID === undefined || incidentID === '') {
      throw new ParameterError('invalid incidentID parameter')
    }

    return await getIncidentUpdates(incidentID)
  }

  validate (incidentID, name, incidentStatus, message, components) {
    if (incidentID === undefined || incidentID === '') {
      throw new ParameterError('invalid incidentID parameter')
    }

    if (name === undefined || name === '') {
      throw new ParameterError('invalid name parameter')
    }

    if (incidentStatuses.indexOf(incidentStatus) < 0) {
      throw new ParameterError('invalid incident status parameter')
    }

    if (message === undefined) {
      throw new ParameterError('invalid message parameter')
    }

    if (components === undefined || !Array.isArray(components)) {
      throw new ParameterError('invalid components parameter')
    }

    for (let i = 0; i < components.length; i++) {
      const comp = components[i]
      if (comp.componentID === undefined || comp.componentID === '') {
        throw new ParameterError('invalid componentID parameter')
      }

      if (componentStatuses.indexOf(comp.status) < 0) {
        throw new ParameterError('invalid component status parameter')
      }
    }
  }

  async updateIncidentWithRetry (incidentID, name, incidentStatus, message, components) {
    const updatedAt = new Date().toISOString()
    const numRetries = 5
    let i, updatedIncident, updatedComponents
    for (i = 0; i < numRetries; i++) {
      try {
        updatedIncident = await updateIncident(incidentID, name, incidentStatus, updatedAt, true)
        delete updatedIncident.Attributes.updating
        await updateIncidentUpdate(incidentID, incidentStatus, message, updatedAt)

        updatedComponents = await Promise.all(components.map(async function(component) {
          const updatedComponent = await updateComponentStatus(component.componentID, component.status)
          return updatedComponent.Attributes
        }))

        await updateIncident(incidentID, name, incidentStatus, updatedAt, false)
        break
      } catch (error) {
        console.log(error.message)
        console.log(error.stack)
        console.log('retry...')
      }
    }
    if (i === numRetries) {
      console.log('retry limit exceeded')
      throw new Error('retry limit exceeded')
    }

    return {
      incident: updatedIncident.Attributes,
      components: updatedComponents
    }
  }

  async createIncident (name, incidentStatus, message, components) {
    const incidentID = generateID()
    this.validate(incidentID, name, incidentStatus, message, components)

    // existence check
    for (let i = 0; i < components.length; i++) {
      await getComponent(components[i].componentID)
    }

    return await this.updateIncidentWithRetry(incidentID, name, incidentStatus, message, components)
  }

  async updateIncident (incidentID, name, incidentStatus, message, components) {
    this.validate(incidentID, name, incidentStatus, message, components)

    // existence check
    await getIncident(incidentID)
    for (let i = 0; i < components.length; i++) {
      await getComponent(components[i].componentID)
    }

    return await this.updateIncidentWithRetry(incidentID, name, incidentStatus, message, components)
  }

  async deleteIncident (incidentID) {
    if (incidentID === undefined || incidentID === '') {
      throw new ParameterError('invalid incidentID parameter')
    }

    await getIncident(incidentID)  // existence check

    const incidentUpdates = await getIncidentUpdates(incidentID)
    await deleteIncident(incidentID)
    await deleteIncidentUpdates(incidentID, incidentUpdates)
  }
}
