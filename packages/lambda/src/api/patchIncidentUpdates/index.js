import { IncidentUpdate } from 'model/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import SNS, {messageType} from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const incidentUpdate = new IncidentUpdate({
      incidentID,
      incidentUpdateID: event.params.incidentupdateid,
      ...event.body
    })
    incidentUpdate.validate()

    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.update(incidentUpdate)

    await new SNS().notifyIncident(incidentID, messageType.incidentPatched)

    callback(null, incidentUpdate.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to update the incident update')
    }
  }
}
