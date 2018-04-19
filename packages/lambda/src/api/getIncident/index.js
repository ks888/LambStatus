import EventsHandler from 'api/eventsHandler'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    const [incident, incidentUpdates] = await handler.getEvent(incidentID)

    callback(null, {...incident.objectify(), incidentUpdates: incidentUpdates.map(upd => upd.objectify())})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
