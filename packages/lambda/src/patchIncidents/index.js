import { updateIncident, updateIncidentUpdate, updateComponentStatus, removeUpdatingFlag } from '../utils/dynamoDB'
import { componentStatuses, incidentStatuses } from '../utils/const'
import { ValidationError } from '../utils/errors'

export async function handler (event, context, callback) {
  try {
    if (event.body.name === undefined || event.body.name === '') {
      throw new ValidationError('invalid name parameter')
    }

    if (incidentStatuses.indexOf(event.body.incidentStatus) < 0) {
      throw new ValidationError('invalid incident status parameter')
    }

    if (event.body.message === undefined || event.body.message === '') {
      throw new ValidationError('invalid message parameter')
    }

    if (event.body.components === undefined || !Array.isArray(event.body.components)) {
      throw new ValidationError('invalid components parameter')
    }

    for (let i = 0; i < event.body.components.length; i++) {
      const comp = event.body.components[i]
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

  const incidentID = event.params.incidentid
  const updatedAt = new Date().toISOString()
  const numRetries = 5
  let i, incident, components
  for (i = 0; i < numRetries; i++) {
    try {
      incident = await updateIncident(incidentID, event.body.name, event.body.incidentStatus, updatedAt)
      await updateIncidentUpdate(incidentID, event.body.incidentStatus,
        event.body.message, updatedAt)

      components = await Promise.all(event.body.components.map(async function(component) {
        let newComponent = await updateComponentStatus(component.componentID, component.status)
        return newComponent.Attributes
      }))

      await removeUpdatingFlag(incidentID)
      break
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      console.log('retry...')
    }
  }
  if (i === numRetries) {
    console.log('retry limit exceeded')
    callback('Error: failed to update Incident')
  }

  let resp = {
    incident: incident.Attributes,
    components: components
  }
  callback(null, JSON.stringify(resp))
}
