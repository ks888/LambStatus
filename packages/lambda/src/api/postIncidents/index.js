import EventsHandler from 'api/eventsHandler'
import { messageType } from 'aws/sns'
import { Incident, IncidentUpdate } from 'model/incidents'
import { Component } from 'model/components'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

export async function handle (event, context, callback) {
  try {
    const incident = new Incident(event)
    const incidentUpdate = new IncidentUpdate({
      incidentStatus: event.status,
      ...event
    })
    const components = event.components === undefined ? [] : event.components.map(comp => new Component(comp))
    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    const msgType = messageType.incidentCreated
    const [respIncident, respIncidentUpdate] = await handler.createEvent(incident, incidentUpdate, msgType, components)

    const resp = {
      ...respIncident.objectify(),
      incidentUpdates: [respIncidentUpdate.objectify()]
    }
    if (event.components !== undefined) {
      resp.components = event.components
    }
    callback(null, resp)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: ' + error.message)
  }
}
