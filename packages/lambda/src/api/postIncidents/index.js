import SNS, {messageType} from 'aws/sns'
import { Incident, IncidentUpdate } from 'model/incidents'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { updateComponentStatus } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    const incident = new Incident(event)
    incident.validateExceptID()
    const incidentsStore = new IncidentsStore()
    await incidentsStore.create(incident)

    let incidentUpdate = new IncidentUpdate({
      incidentID: incident.incidentID,
      incidentStatus: event.status,
      ...event
    })
    incidentUpdate.validateExceptUpdateID()
    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.create(incidentUpdate)

    const incidentWithIncidentUpdate = {
      ...incident.objectify(),
      incidentUpdates: [incidentUpdate.objectify()]
    }

    if (event.components !== undefined) {
      await Promise.all(event.components.map(async (component) => {
        await updateComponentStatus(component)
      }))

      incidentWithIncidentUpdate.components = event.components
    }

    await new SNS().notifyIncident(incident.incidentID, messageType.incidentCreated)

    callback(null, incidentWithIncidentUpdate)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to create a new incident')
    }
  }
}
