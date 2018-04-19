import EventsHandler from 'api/eventsHandler'
import { messageType } from 'aws/sns'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'
import { Component } from 'model/components'
import { Incident, IncidentUpdate } from 'model/incidents'
import { NotFoundError, ValidationError } from 'utils/errors'

export async function handle (event, context, callback) {
  try {
    const incidentID = event.params.incidentid
    const eventsStore = new IncidentsStore()
    const existingIncident = await eventsStore.get(incidentID)
    const newIncident = new Incident({...existingIncident.objectify(), ...event.body})
    const incidentUpdate = new IncidentUpdate({
      incidentID,
      incidentStatus: (event.body.status === undefined ? newIncident.status : event.body.status),
      message: event.body.message
    })
    const components = event.body.components === undefined ? [] : event.body.components.map(comp => new Component(comp))

    const handler = new EventsHandler(new IncidentsStore(), new IncidentUpdatesStore())
    const msgType = messageType.incidentUpdated
    const [respIncident, respIncidentUpds] = await handler.updateEvent(newIncident, incidentUpdate, msgType, components)

    const resp = {
      ...respIncident.objectify(),
      incidentUpdates: respIncidentUpds.map(upd => upd.objectify())
    }
    if (event.body.components !== undefined) {
      resp.components = components
    }

    callback(null, resp)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case ValidationError.name:
        callback('Error: ' + error.message)
        break
      case NotFoundError.name:
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to update the incident')
    }
  }
}
