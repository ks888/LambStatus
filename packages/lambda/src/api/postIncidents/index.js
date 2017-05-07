import { Incident } from 'model/incidents'
import SNS from 'aws/sns'

export async function handle (event, context, callback) {
  try {
    const incident = new Incident(undefined, event.name, event.incidentStatus, event.message,
                                  event.components)
    await incident.validate()
    await incident.save()

    await new SNS().notifyIncident(incident)

    const obj = incident.objectify()
    const comps = obj.components
    delete obj.components
    callback(null, JSON.stringify({
      incident: obj,
      components: comps
    }))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      default:
        callback('Error: failed to create a new incident')
    }
  }
}
