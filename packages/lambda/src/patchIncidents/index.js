import { updateIncident, updateIncidentUpdate, updateComponentStatus, removeUpdatingFlag } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  const incidentID = event.params.incidentid
  const updatedAt = new Date().toISOString()
  const numRetries = 5
  let i, incident, incidentUpdate
  for (i = 0; i < numRetries; i++) {
    try {
      incident = await updateIncident(incidentID, event.body.name, event.body.incidentStatus, updatedAt)
      incidentUpdate = await updateIncidentUpdate(incidentID, event.body.incidentStatus,
        event.body.message, updatedAt)

      event.body.components.forEach(async function(component) {
        try {
          await updateComponentStatus(component.componentID, component.status)
        } catch (error) {
          throw error
        }
      })

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
    incidentUpdate: incidentUpdate.Attributes
  }
  callback(null, JSON.stringify(resp))
}
