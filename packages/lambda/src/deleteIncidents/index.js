import IncidentService from 'service/incident'

export async function handler (event, context, callback) {
  const service = new IncidentService()
  try {
    await service.deleteIncident(event.params.incidentid)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'NotFoundError') {
      callback('Error: an item not found')
      return
    }
    callback('Error: failed to delete an incident')
  }
}
