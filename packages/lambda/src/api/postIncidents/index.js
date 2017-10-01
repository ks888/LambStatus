import SNS from 'aws/sns'
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

    if (event.components !== undefined) {
      await Promise.all(event.components.map(async (component) => {
        await updateComponentStatus(component)
      }))
    }

    const incidentWithIncidentUpdate = Object.assign(incidentUpdate.objectify(), incident.objectify())
    await new SNS().notifyIncident(incidentWithIncidentUpdate)

    callback(null, {
      incident: incidentWithIncidentUpdate,
      components: event.components
    })
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
