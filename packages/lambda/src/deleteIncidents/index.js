import { deleteIncident, getIncidentUpdates, deleteIncidentUpdates } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let incidentUpdates = await getIncidentUpdates(event.params.incidentid)
    await deleteIncident(event.params.incidentid)
    await deleteIncidentUpdates(event.params.incidentid, incidentUpdates)
  } catch (error) {
    console.log('deleteIncidents error', error)
    console.log(error.stack)
    callback('Error: failed to delete an incident')
  }
}
