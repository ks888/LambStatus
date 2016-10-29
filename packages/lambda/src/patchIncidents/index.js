import IncidentService from 'service/incident'

export async function handler (event, context, callback) {
  const service = new IncidentService()
  try {
    const incident = await service.updateIncident(event.params.incidentid, event.body.name,
       event.body.incidentStatus, event.body.message, event.body.components)
    callback(null, JSON.stringify(incident))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    if (error.name === 'ParameterError') {
      callback('Error: ' + error.message)
    } else {
      callback('Error: ' + error.message)
    }
  }
}
