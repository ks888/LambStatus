import SNS from 'aws/sns'
import { Incident, IncidentUpdate } from 'model/incidents'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { updateComponentStatus } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    const incidentsStore = new IncidentsStore()
    const incident = await incidentsStore.get(event.params.incidentid)
    delete incident.updatedAt

    const newIncident = new Incident({...incident.objectify(), ...event.body})
    newIncident.validate()
    await incidentsStore.update(newIncident)

    let incidentUpdate = new IncidentUpdate({
      incidentID: event.params.incidentid,
      incidentStatus: (event.body.status === undefined ? newIncident.status : event.body.status),
      message: event.body.message
    })
    incidentUpdate.validateExceptUpdateID()
    const incidentUpdatesStore = new IncidentUpdatesStore()
    await incidentUpdatesStore.create(incidentUpdate)

    const incidentUpdates = await incidentUpdatesStore.query(event.params.incidentid)
    const incidentWithIncidentUpdate = {
      ...newIncident.objectify(),
      incidentUpdates: incidentUpdates.map(upd => upd.objectify())
    }

    if (event.body.components !== undefined) {
      await Promise.all(event.body.components.map(async (component) => {
        await updateComponentStatus(component)
      }))

      incidentWithIncidentUpdate.components = event.components
    }

    await new SNS().notifyIncident(incidentWithIncidentUpdate)

    callback(null, incidentWithIncidentUpdate)
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
