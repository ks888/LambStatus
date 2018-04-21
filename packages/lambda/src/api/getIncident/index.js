import EventsHandler from 'api/eventsHandler'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { NotFoundError } from 'utils/errors'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    const [incident, incidentUpdates] = await handler.getEvent(incidentID)

    callback(null, {...incident.objectify(), incidentUpdates: incidentUpdates.map(upd => upd.objectify())})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case NotFoundError.name:
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to get an incident')
    }
  }
}
