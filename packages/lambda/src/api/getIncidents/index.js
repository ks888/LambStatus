import getEvents from 'api/getEvents'
import IncidentsStore from 'db/incidents'

export async function handle (event, context, callback) {
  try {
    const incidents = await getEvents(new IncidentsStore())
    callback(null, incidents.map(incident => incident.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
