import IncidentService from 'service/incident'

export async function handler (event, context, callback) {
  const service = new IncidentService()
  try {
    console.log(event.body)
    const incident = await service.createIncident(event.name, event.incidentStatus,
      event.message, event.components)
    callback(null, JSON.stringify(incident))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ParameterError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to create a new incident')
    }
  }
}
