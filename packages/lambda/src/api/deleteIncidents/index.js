import EventsHandler from 'api/eventsHandler'
import { messageType } from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    const incidentID = event.params.incidentid
    await handler.deleteEvent(incidentID, messageType.incidentDeleted)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
