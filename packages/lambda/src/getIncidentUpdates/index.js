import IncidentService from 'service/incident'

export async function handler (event, context, callback) {
  const service = new IncidentService()
  try {
    let incidentUpdates = await service.getIncidentUpdates(event.params.incidentid)
    callback(null, JSON.stringify(incidentUpdates))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ParameterError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to get incident updates list')
    }
  }
}
