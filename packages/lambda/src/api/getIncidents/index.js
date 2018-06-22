import EventsHandler from 'api/eventsHandler'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    let incidents = await handler.listEvents()

    // Show the incidents as if the incident has happened yesterday.
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayDate = yesterday.toISOString().replace(/T[0-9:.]+Z$/, '')
    incidents = incidents.map((incident) => {
      incident.createdAt = yesterdayDate + incident.createdAt.replace(/^[0-9-]+/, '')
      incident.updatedAt = yesterdayDate + incident.updatedAt.replace(/^[0-9-]+/, '')
      return incident
    })

    callback(null, incidents.map(incident => incident.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get incidents list')
  }
}
