import { getIncidentUpdates } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let incidentUpdates = await getIncidentUpdates(event.incidentID)
    callback(null, JSON.stringify(incidentUpdates))
  } catch (error) {
    console.log('getIncidentUpdates error', error)
    console.log(error.stack)
    callback('Error: failed to get incident updates list')
  }
}
