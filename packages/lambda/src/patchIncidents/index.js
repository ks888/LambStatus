import { updateIncident, updateIncidentUpdate, updateComponentStatus, removeUpdatingFlag } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
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
        try {
          let newComponent = await updateComponentStatus(component.componentID, component.status)
          return newComponent.Attributes
        } catch (error) {
          throw error
        }
      }))

      removeUpdatingFlag(incidentID)
      break
    } catch (error) {
      console.log('failed to update Incident: ', error)
      console.log(error.stack)
      console.log('retry...')
    }
  }
  if (i === numRetries) {
    console.log('failed to update Incident. Retry limit exceeded')
    callback('Error: failed to update Incident')
  }

  let resp = {
    incident: incident.Attributes,
    components: components
  }
  callback(null, JSON.stringify(resp))
}
