import assert from 'assert'
import { v0GetIncidents, v0GetIncident, v0PostIncidents, v0PatchIncidents, v0DeleteIncident } from './apis'

describe('V0Incidents', () => {
  before(async () => {
    const {body} = await v0GetIncidents()
    await Promise.all(body.map(async (incident) => {
      await v0DeleteIncident(incident.incidentID)
    }))
  })

  describe('Get Incidents', () => {
    it('should return the list of incidents', async () => {
      await v0PostIncidents()

      const {response, body} = await v0GetIncidents()
      assert(response.status === 200)
      assert(body.length === 1)
      assert(body[0].incidentID !== '')
    })
  })

  describe('Get Incident', () => {
    it('should return one incident', async () => {
      const {body: incident} = await v0PostIncidents()

      const {response, body} = await v0GetIncident(incident.incidentID)
      assert(response.status === 200)
      assert(body.incidentID === incident.incidentID)
      assert(body.incidentUpdates.length === incident.incidentUpdates.length)
      assert(body.incidentUpdates[0].incidentUpdateID === incident.incidentUpdates[0].incidentUpdateID)
    })
  })

  describe('Post', () => {
    it('should create a new incident', async () => {
      const {response, body} = await v0PostIncidents()
      assert(response.status === 200)
      assert(body.incidentID !== '')
      assert(body.incidentUpdates.incidentUpdateID !== '')
      assert(body.components === undefined)
    })

    it('should return validation error if invalid param', async () => {
      const {response, body} = await v0PostIncidents({name: ''})
      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/valid/))
    })
  })

  describe('Patch', () => {
    it('should update the existing incident', async () => {
      const {body: incident} = await v0PostIncidents()
      const {response, body} = await v0PatchIncidents(incident.incidentID, {name: 'I2'})

      assert(response.status === 200)
      assert(body.name === 'I2')
      assert(body.status === incident.status)
      assert(body.updatedAt !== incident.updatedAt)
      assert(body.incidentUpdates.length === incident.incidentUpdates.length + 1)
      assert(body.components === undefined)
    })

    it('should return not found error if id not found', async () => {
      const {response, body} = await v0PatchIncidents('1')

      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/not found/))
    })

    it('should return validation error if invalid param', async () => {
      const {body: incident} = await v0PostIncidents()
      const {response, body} = await v0PatchIncidents(incident.incidentID, {name: ''})

      assert(response.status === 400)
      assert(body.errors.length === 1)
      assert(body.errors[0].message.match(/valid/))
    })
  })

  describe('Delete', () => {
    it('should delete the existing incident', async () => {
      const {body} = await v0PostIncidents()
      const {response} = await v0DeleteIncident(body.incidentID)

      assert(response.status === 204)
    })

    it('should return no error even if the incident doesn\'t exist', async () => {
      const {response} = await v0DeleteIncident('1')
      assert(response.status === 204)
    })
  })
})
