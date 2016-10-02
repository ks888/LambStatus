import { updateIncident, updateIncidentUpdate, updateComponentStatus, removeUpdatingFlag } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  const updatedAt = new Date().toISOString()
  const numRetries = 5
  let i, incident
  for (i = 0; i < numRetries; i++) {
    try {
      incident = await updateIncident(null, event.name, event.incidentStatus, updatedAt)
      await updateIncidentUpdate(incident.Attributes.incidentID, event.incidentStatus, event.message, updatedAt)

      event.components.forEach(async function(component) {
        try {
          await updateComponentStatus(component.componentID, component.status)
        } catch (error) {
          throw error
        }
      })

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

  callback(null, JSON.stringify(incident.Attributes))
}
