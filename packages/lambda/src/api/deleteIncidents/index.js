import SNS from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const store = new IncidentsStore()
    const incident = await store.get(event.params.incidentid)
    await store.delete(incident.incidentID)

    const updateStore = new IncidentUpdatesStore()
    const incidentUpdates = await updateStore.query(incident.incidentID)
    await updateStore.delete(event.params.incidentid, incidentUpdates.map(upd => upd.incidentUpdateID))

    await new SNS().notifyIncident(incident)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to delete the incident')
  }
}
