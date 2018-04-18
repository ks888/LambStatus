import deleteEvents from 'api/deleteEvents'
import { messageType } from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const eventsStore = new IncidentsStore()
    const eventUpdatesStore = new IncidentUpdatesStore()
    const incidentID = event.params.incidentid
    await deleteEvents(incidentID, messageType.incidentDeleted, eventsStore, eventUpdatesStore)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
