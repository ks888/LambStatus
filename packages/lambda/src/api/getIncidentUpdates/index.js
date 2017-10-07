import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const incidentUpdates = await new IncidentUpdatesStore().query(event.params.incidentid)
    callback(null, incidentUpdates.map(incidentUpdate => incidentUpdate.objectify()))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to get incident updates')
    }
  }
}
