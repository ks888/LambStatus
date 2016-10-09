import { updateIncident, updateIncidentUpdate, updateComponentStatus, removeUpdatingFlag } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  const updatedAt = new Date().toISOString()
  const numRetries = 5
  let i, incident, components
  for (i = 0; i < numRetries; i++) {
    try {
      incident = await updateIncident(null, event.name, event.incidentStatus, updatedAt)
      await updateIncidentUpdate(incident.Attributes.incidentID, event.incidentStatus, event.message, updatedAt)

      components = await Promise.all(event.components.map(async function(component) {
        try {
          let newComponent = await updateComponentStatus(component.componentID, component.status)
          return newComponent.Attributes
        } catch (error) {
          throw error
        }
      }))

      removeUpdatingFlag(incident.Attributes.incidentID)
      delete incident.Attributes.updating
      break
    } catch (error) {
      console.log('failed to add Incident: ', error)
      console.log(error.stack)
      console.log('retry...')
    }
  }
  if (i === numRetries) {
    console.log('failed to add Incident. Retry limit exceeded')
    callback('Error: failed to add Incident')
  }

  let resp = {
    incident: incident.Attributes,
    components: components
  }
  callback(null, JSON.stringify(resp))
}
