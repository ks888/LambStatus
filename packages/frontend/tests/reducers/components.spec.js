import fetchMock from 'fetch-mock'
import { LIST_COMPONENTS, listComponents } from 'actions/components'
import reducer from 'reducers/components'
import { requestStatus } from 'utils/status'

describe('(Reducer) components', () => {
  const comp1 = {
    componentID: 'compID1',
    name: 'name1',
    description: 'desc1',
    status: 'status1',
    order: 0
  }
  const comp2 = {
    componentID: 'compID2',
    name: 'name2',
    description: 'desc2',
    status: 'status2',
    order: 0
  }

  describe('listComponentsHandler', () => {
    const comp1JSON = JSON.stringify([comp1])
    const comp12JSON = JSON.stringify([comp1, comp2])

    it('Should properly set the `components` state.', () => {
      let state = reducer(undefined, listComponents(comp1JSON))
      expect(state.components).to.deep.equal([comp1])

      state = reducer(undefined, listComponents(comp12JSON))
      expect(state.components).to.deep.equal([comp1, comp2])
    })
  })

  describe('componentsReducer', () => {
    it('Should be a function.', () => {
      expect(reducer).to.be.a('function')
    })

    it('Should initialize states.', () => {
      const initialState = reducer(undefined, {})
      expect(initialState.components).to.be.empty
    })

    it('Should return the previous state if an action was not matched.', () => {
      const state = {
        components: [1]
      }
      let returnedState = reducer(state, {})
      expect(state.components).to.equal(returnedState.components)
    })
  })
})
