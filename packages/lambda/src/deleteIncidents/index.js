import { deleteIncident, getIncidentUpdates, deleteIncidentUpdates } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    const incidentUpdates = await getIncidentUpdates(event.params.incidentid)
    await deleteIncident(event.params.incidentid)
    await deleteIncidentUpdates(event.params.incidentid, incidentUpdates)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'NotFoundError') {
      callback('Error: an item not found')
      return
    }
    callback('Error: failed to delete an incident')
  }
}
