import getEvent from 'api/getEvent'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const incidentStore = new IncidentsStore()
    const incidentUpdateStore = new IncidentUpdatesStore()
    const [incident, incidentUpdates] = await getEvent(incidentID, incidentStore, incidentUpdateStore)

    callback(null, {...incident.objectify(), incidentUpdates: incidentUpdates.map(upd => upd.objectify())})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
