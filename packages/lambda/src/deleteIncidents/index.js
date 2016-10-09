import { deleteIncident, deleteIncidentUpdates } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    await deleteIncident(event.params.incidentid)
    await deleteIncidentUpdates(event.params.incidentid)
  } catch (error) {
    console.log('deleteIncidents error', error)
    console.log(error.stack)
    callback('Error: failed to delete an incident')
  }
}
