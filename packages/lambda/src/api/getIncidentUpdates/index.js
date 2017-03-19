import { Incidents } from 'model/incidents'

export async function handle (event, context, callback) {
  try {
    const incidents = new Incidents()
    const incident = await incidents.lookup(event.params.incidentid)
    const incidentUpdates = await incident.getIncidentUpdates()
    callback(null, JSON.stringify(incidentUpdates))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to get incident updates')
    }
  }
}
