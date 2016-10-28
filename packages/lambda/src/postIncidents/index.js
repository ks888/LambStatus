import { updateIncident, updateIncidentUpdate, updateComponentStatus, removeUpdatingFlag } from '../utils/dynamoDB'
import { componentStatuses, incidentStatuses } from '../utils/const'
import { ValidationError } from '../utils/errors'

export async function handler (event, context, callback) {
  try {
    if (event.name === undefined || event.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (incidentStatuses.indexOf(event.incidentStatus) < 0) {
      throw new ValidationError('invalid incident status parameter')
    }

    if (event.message === undefined || event.message === '') {
      throw new ValidationError('invalid message parameter')
    }

    if (event.components === undefined || !Array.isArray(event.components)) {
      throw new ValidationError('invalid components parameter')
    }

    for (let i = 0; i < event.components.length; i++) {
      const comp = event.components[i]
      if (comp.componentID === undefined || comp.componentID === '') {
        throw new ValidationError('invalid componentID parameter')
      }

      if (componentStatuses.indexOf(comp.status) < 0) {
        throw new ValidationError('invalid component status parameter')
      }
    }
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
    return
  }

  const updatedAt = new Date().toISOString()
  const numRetries = 5
  let i, incident, components
  for (i = 0; i < numRetries; i++) {
    try {
      incident = await updateIncident(null, event.name, event.incidentStatus, updatedAt)
      await updateIncidentUpdate(incident.Attributes.incidentID, event.incidentStatus, event.message, updatedAt)

      components = await Promise.all(event.components.map(async function(component) {
        let newComponent = await updateComponentStatus(component.componentID, component.status)
        return newComponent.Attributes
      }))

      await removeUpdatingFlag(incident.Attributes.incidentID)
      delete incident.Attributes.updating
      break
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      console.log('retry...')
    }
  }
  if (i === numRetries) {
    console.log('retry limit exceeded')
    callback('Error: failed to add Incident')
    return
  }

  let resp = {
    incident: incident.Attributes,
    components: components
  }
  callback(null, JSON.stringify(resp))
}
