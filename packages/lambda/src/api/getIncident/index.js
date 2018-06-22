import EventsHandler from 'api/eventsHandler'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { NotFoundError } from 'utils/errors'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    let [incident, incidentUpdates] = await handler.getEvent(incidentID)

    // Show the incidents as if the incident has happened yesterday.
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayDate = yesterday.toISOString().replace(/T[0-9:.]+Z$/, '')
    incident.createdAt = yesterdayDate + incident.createdAt.replace(/^[0-9-]+/, '')
    incident.updatedAt = yesterdayDate + incident.updatedAt.replace(/^[0-9-]+/, '')

    // Show the incident updates as if they have happened yesterday.
    incidentUpdates = incidentUpdates.map(incidentUpdate => {
      incidentUpdate.createdAt = yesterdayDate + incidentUpdate.createdAt.replace(/^[0-9-]+/, '')
      incidentUpdate.updatedAt = yesterdayDate + incidentUpdate.updatedAt.replace(/^[0-9-]+/, '')
      return incidentUpdate
    })

    callback(null, {...incident.objectify(), incidentUpdates: incidentUpdates.map(upd => upd.objectify())})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case NotFoundError.name:
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to get an incident')
    }
  }
}
