import EventsHandler from 'api/eventsHandler'
import { IncidentUpdate } from 'model/incidents'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { messageType } from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const incidentUpdate = new IncidentUpdate({
      incidentID,
      incidentUpdateID: event.params.incidentupdateid,
      ...event.body
    })
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    await handler.updateEventUpdate(incidentUpdate, messageType.incidentPatched)

    callback(null, incidentUpdate.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
