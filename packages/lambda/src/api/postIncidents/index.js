import { messageType } from 'aws/sns'
import { Incident, IncidentUpdate } from 'model/incidents'
import { Component } from 'model/components'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import postEvents from 'api/postEvents'

export async function handle (event, context, callback) {
  try {
    const incident = new Incident(event)
    const incidentUpdate = new IncidentUpdate({
      incidentStatus: event.status,
      ...event
    })
    const components = event.components === undefined ? [] : event.components.map(comp => new Component(comp))
    const eventsStore = new IncidentsStore()
    const eventUpdatesStore = new IncidentUpdatesStore()
    await postEvents(incident, incidentUpdate, messageType.incidentCreated, components, eventsStore, eventUpdatesStore)

    const resp = {
      ...incident.objectify(),
      incidentUpdates: [incidentUpdate.objectify()]
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
