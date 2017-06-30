import { listIncidents, listIncidentUpdates, addIncident, editIncident,
         removeIncident } from 'actions/incidents'
import incidentsReducer from 'reducers/incidents'

describe('Reducers/incidents', () => {
  const incident1 = {
    incidentID: '1',
    name: 'name1',
    status: 'status1',
    updatedAt: '1'
  }
  const incidentUpdate1 = {
    incidentUpdateID: '1',
    incidentStatus: 'status1',
    message: 'message1',
    updatedAt: '1'
  }
  const incident2 = {
    incidentID: '2',
    name: 'name2',
    status: 'status2',
    updatedAt: '2'
  }

  describe('listIncidentsHandler', () => {
    it('should update the incidents.', () => {
      const state = incidentsReducer(undefined, listIncidents([incident1]))
      assert.deepEqual([incident1], state.incidents)
    })

    it('should sort the incidents.', () => {
      const state = incidentsReducer(undefined, listIncidents([incident1, incident2]))
      assert.deepEqual([incident2, incident1], state.incidents)
    })
  })

  describe('listIncidentUpdatesHandler', () => {
    it('should update the incident updates.', () => {
      const state = incidentsReducer({incidents: [incident1]},
                                     listIncidentUpdates([incidentUpdate1], incident1.incidentID))
      assert(state.incidents.length === 1)
      assert(state.incidents[0].incidentUpdates.length === 1)
      assert.deepEqual(state.incidents[0].incidentUpdates[0], incidentUpdate1)
    })

    it('should sort the incident updates.', () => {
      const updates = [incidentUpdate1, {...incidentUpdate1, incidentUpdateID: '2', updatedAt: '2'}]
      const state = incidentsReducer({incidents: [incident1]},
                                     listIncidentUpdates(updates, incident1.incidentID))
      assert(state.incidents.length === 1)
      assert(state.incidents[0].incidentUpdates.length === 2)
      assert(state.incidents[0].incidentUpdates[0].incidentUpdateID === '2')
    })
  })

  describe('addIncidentHandler', () => {
    it('should add the new incident.', () => {
      const state = incidentsReducer({incidents: [incident1]}, addIncident({incident: incident2}))
      assert.deepEqual([incident2, incident1], state.incidents)
    })
  })

  describe('editIncidentHandler', () => {
    it('should update the `incidents` state.', () => {
      const newName = 'newName'
      const newIncident = { ...incident1, name: newName }
      const state = incidentsReducer({incidents: [incident1]}, editIncident({incident: newIncident}))
      assert.deepEqual([newIncident], state.incidents)
    })
  })

  describe('removeIncidentHandler', () => {
    it('should delete the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]}, removeIncident('1'))
      assert(state.incidents.length === 0)
    })
  })
})
