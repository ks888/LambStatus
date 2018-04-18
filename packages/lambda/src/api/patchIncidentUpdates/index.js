import { IncidentUpdate } from 'model/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { messageType } from 'aws/sns'
import patchEventUpdates from 'api/patchEventUpdates'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const incidentUpdate = new IncidentUpdate({
      incidentID,
      incidentUpdateID: event.params.incidentupdateid,
      ...event.body
    })
    const eventUpdatesStore = new IncidentUpdatesStore()
    await patchEventUpdates(incidentUpdate, messageType.incidentPatched, eventUpdatesStore)

    callback(null, incidentUpdate.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
