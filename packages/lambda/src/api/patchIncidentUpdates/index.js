import { IncidentUpdate } from 'model/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import SNS from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const incidentUpdate = new IncidentUpdate({
      incidentID: event.params.incidentid,
      incidentUpdateID: event.params.incidentupdateid,
      incidentStatus: event.body.status,
      ...event.body
    })
    incidentUpdate.validate()

    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.update(incidentUpdate)

    await new SNS().notifyIncident(incidentUpdate)

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
