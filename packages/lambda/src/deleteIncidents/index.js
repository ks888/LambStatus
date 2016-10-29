import IncidentService from 'service/incident'

export async function handler (event, context, callback) {
  const service = new IncidentService()
  try {
    await service.deleteIncident(event.params.incidentid)
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
        callback('Error: failed to delete an incident')
    }
  }
}
