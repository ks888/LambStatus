import SNS from 'aws/sns'
import { Incident, IncidentUpdate } from 'model/incidents'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { updateComponentStatus } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    let params = {incidentID: event.params.incidentid, ...event.body}
    const incident = new Incident(params)
    incident.validate()
    const incidentsStore = new IncidentsStore()
    await incidentsStore.update(incident)

    let incidentUpdate = new IncidentUpdate({incidentStatus: event.body.status, ...params})
    incidentUpdate.validate()
    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.create(incidentUpdate)

    if (event.body.components !== undefined) {
      await Promise.all(event.body.components.map(async (component) => {
        await updateComponentStatus(component)
      }))
    }

    const incidentWithIncidentUpdate = Object.assign(incidentUpdate.objectify(), incident.objectify())
    await new SNS().notifyIncident(incidentWithIncidentUpdate)

    callback(null, {
      incident: incidentWithIncidentUpdate,
      components: event.body.components
    })
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to update the incident')
    }
  }
}
