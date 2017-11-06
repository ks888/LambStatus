import { listIncidents, listIncident, addIncident, editIncident, editIncidentUpdate,
         removeIncident } from 'actions/incidents'
import incidentsReducer from 'reducers/incidents'

describe('Reducers/incidents', () => {
  const incident1 = {
    incidentID: '1',
    name: 'name1',
    status: 'status1',
    createdAt: '1'
  }
  const incidentUpdate1 = {
    incidentID: '1',
    incidentUpdateID: '1',
    incidentStatus: 'status1',
    message: 'message1',
    createdAt: '1'
  }
  const incident2 = {
    incidentID: '2',
    name: 'name2',
    status: 'status2',
    createdAt: '2'
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

  describe('listIncidentHandler', () => {
    it('should update the incident.', () => {
      const incident = {
        ...incident1,
        incidentUpdates: [incidentUpdate1]
      }
      const state = incidentsReducer({incidents: [incident1]},
                                     listIncident(incident, incident1.incidentID))
      assert(state.incidents.length === 1)
      assert(state.incidents[0].incidentUpdates.length === 1)
      assert.deepEqual(state.incidents[0].incidentUpdates[0], incidentUpdate1)
    })

    it('should sort the incident.', () => {
      const incident = {
        ...incident1,
        incidentUpdates: [incidentUpdate1, {...incidentUpdate1, incidentUpdateID: '2', createdAt: '2'}]
      }
      const state = incidentsReducer({incidents: [incident1]},
                                     listIncident(incident, incident.incidentID))
      assert(state.incidents.length === 1)
      assert(state.incidents[0].incidentUpdates.length === 2)
      assert(state.incidents[0].incidentUpdates[0].incidentUpdateID === '2')
    })
  })

  describe('addIncidentHandler', () => {
    it('should add the new incident.', () => {
      const state = incidentsReducer({incidents: [incident1]}, addIncident(incident2))
      assert.deepEqual([incident2, incident1], state.incidents)
    })
  })

  describe('editIncidentHandler', () => {
    it('should update the `incidents` state.', () => {
      const newName = 'newName'
      const newIncident = { ...incident1, name: newName }
      const state = incidentsReducer({incidents: [incident1]}, editIncident(newIncident))
      assert.deepEqual([newIncident], state.incidents)
    })
  })

  describe('editIncidentUpdateHandler', () => {
    it('should update the incident update.', () => {
      const existingIncident = {...incident1, incidentUpdates: [incidentUpdate1]}
      const newIncidentUpdate = {...incidentUpdate1, message: 'new'}
      const state = incidentsReducer({incidents: [existingIncident]}, editIncidentUpdate(newIncidentUpdate))
      assert(state.incidents[0].incidentUpdates[0].message === 'new')
    })
  })

  describe('removeIncidentHandler', () => {
    it('should delete the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]}, removeIncident('1'))
      assert(state.incidents.length === 0)
    })
  })
})
