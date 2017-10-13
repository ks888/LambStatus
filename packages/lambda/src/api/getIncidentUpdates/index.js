import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    let incidentUpdates = await new IncidentUpdatesStore().query(event.params.incidentid)

    // Show the incident updates as if they have happened yesterday.
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayDate = yesterday.toISOString().replace(/T[0-9:.]+Z$/, '')
    incidentUpdates = incidentUpdates.map(incidentUpdate => {
      incidentUpdate.createdAt = yesterdayDate + incidentUpdate.createdAt.replace(/^[0-9-]+/, '')
      incidentUpdate.updatedAt = yesterdayDate + incidentUpdate.updatedAt.replace(/^[0-9-]+/, '')
      return incidentUpdate
    })
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
