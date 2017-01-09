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
      const state = incidentsReducer(undefined, listIncidents(JSON.stringify([incident1])))
      expect(state.incidents).to.deep.equal([incident1])
    })
  })

  describe('listIncidentUpdatesHandler', () => {
    it('Should update the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]},
        listIncidentUpdates(JSON.stringify([incidentUpdate1]), '1'))
      expect(state.incidents).to.deep.equal([Object.assign({}, incident1, {
        incidentUpdates: [incidentUpdate1]
      })])
    })
  })

  describe('addIncidentHandler', () => {
    it('Should update the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]}, addIncident(JSON.stringify({incident: incident2})))
      expect(state.incidents).to.deep.equal([incident2, incident1])
    })
  })

  describe('editIncidentHandler', () => {
    it('Should update the `incidents` state.', () => {
      const newIncident1 = Object.assign({}, incident1, {
        name: 'newname'
      })
      const state = incidentsReducer({incidents: [incident1]}, editIncident(JSON.stringify({incident: newIncident1})))
      expect(state.incidents).to.deep.equal([newIncident1])
    })
  })

  describe('removeIncidentHandler', () => {
    it('Should update the `incidents` state.', () => {
      const state = incidentsReducer({incidents: [incident1]}, removeIncident('1'))
      expect(state.incidents).to.deep.equal([])
    })
  })
})
