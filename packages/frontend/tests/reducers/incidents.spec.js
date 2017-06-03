import { listIncidents, listIncidentUpdates, addIncident, editIncident,
  removeIncident } from 'actions/incidents'
import incidentsReducer from 'reducers/incidents'

describe('(Reducer) incidents', () => {
  const incident1 = {
    incidentID: '1',
    name: 'name1',
    status: 'status1',
    updatedAt: ''
  }
  const incidentUpdate1 = {
    incidentUpdateID: '1',
    incidentStatus: 'status1',
    message: 'message1',
    updatedAt: ''
  }
  const incident2 = {
    incidentID: '2',
    name: 'name2',
    status: 'status2',
    updatedAt: ''
  }

  describe('listIncidentsHandler', () => {
    it('Should update the `incidents` state.', () => {
      const state = incidentsReducer(undefined, listIncidents([incident1]))
      assert.deepEqual([incident1], state.incidents)
    })
  })

  describe('listIncidentUpdatesHandler', () => {
    it('Should update the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]},
        listIncidentUpdates([incidentUpdate1], '1'))
      assert.deepEqual([Object.assign({}, incident1, {
        incidentUpdates: [incidentUpdate1]
      })], state.incidents)
    })
  })

  describe('addIncidentHandler', () => {
    it('Should update the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]}, addIncident({incident: incident2}))
      assert.deepEqual([incident2, incident1], state.incidents)
    })
  })

  describe('editIncidentHandler', () => {
    it('Should update the `incidents` state.', () => {
      const newIncident1 = Object.assign({}, incident1, {
        name: 'newname'
      })
      const state = incidentsReducer({incidents: [incident1]}, editIncident({incident: newIncident1}))
      assert.deepEqual([newIncident1], state.incidents)
    })
  })

  describe('removeIncidentHandler', () => {
    it('Should delete the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]}, removeIncident('1'))
      assert.deepEqual([], state.incidents)
    })
  })
})
