import { getIncidentUpdates } from '../utils/dynamoDB'

export async function handler (event, context, callback) {
  try {
    let incidentUpdates = await getIncidentUpdates(event.params.incidentid)
    callback(null, JSON.stringify(incidentUpdates))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'NotFoundError') {
      callback('Error: an item not found')
      return
    }
    callback('Error: failed to get incident updates list')
  }
}
