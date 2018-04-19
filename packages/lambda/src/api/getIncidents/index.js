import EventsHandler from 'api/eventsHandler'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    const incidents = await handler.listEvents()
    callback(null, incidents.map(incident => incident.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
