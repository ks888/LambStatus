import fetchMock from 'fetch-mock'
import {
  LOAD,
  LIST_COMPONENTS,
  loadAction,
  listComponentsAction,
  fetchComponents,
  default as reducer
} from 'routes/Components/modules/components'

describe('(Redux Module) Components', () => {
  const comp1 = {
    componentID: 'compID1',
    name: 'name1',
    description: 'desc1',
    status: 'status1'
  }
  const comp2 = {
    componentID: 'compID2',
    name: 'name2',
    description: 'desc2',
    status: 'status2'
  }

  describe('(Action Creator) loadAction', () => {
    it('Should be exported as a function.', () => {
      expect(loadAction).to.be.a('function')
    })

    it('Should return an action with type "LOAD".', () => {
      expect(loadAction()).to.have.property('type', LOAD)
    })
  })

  describe('(Action Creator) fetchComponents', () => {
    let _globalState, _dispatchSpy

    beforeEach(() => {
      _globalState = {
        components: reducer(undefined, {})
      }
      _dispatchSpy = sinon.spy((action) => {
        _globalState = {
          ..._globalState,
          components: action.serviceComponents
        }
      })

      fetchMock.get(/.*\/components/, { body: [comp1] });
    })

    afterEach(() => {
      fetchMock.restore()
    })

    it('Should be exported as a function.', () => {
      expect(fetchComponents).to.be.a('function')
    })

    it('Should return a function (is a thunk).', () => {
      expect(fetchComponents()).to.be.a('function')
    })

    it('Should call dispatch load action first.', () => {
      return fetchComponents()(_dispatchSpy)
        .then(() => {
          expect(_dispatchSpy.firstCall.args[0].type).to.equal(LOAD)
        })
    })

    it('Should call dispatch list action next.', () => {
      return fetchComponents()(_dispatchSpy)
        .then(() => {
          expect(_dispatchSpy.secondCall.args[0].type).to.equal(LIST_COMPONENTS)
          expect(_dispatchSpy.secondCall.args[0].serviceComponents).to.deep.equal([comp1])
        })
    })
  })

  describe('(Action Handler) LOAD Handler', () => {
    it('Should make the `isFetching` state true.', () => {
      const state = reducer(undefined, loadAction())
      expect(state.isFetching).to.be.true
    })
  })

  // NOTE: if you have a more complex state, you will probably want to verify
  // that you did not mutate the state. In this case our state is just a number
  // (which cannot be mutated).
  describe('(Action Handler) LIST_COMPONENTS Handler', () => {
    const comp1JSON = JSON.stringify([comp1])
    const comp12JSON = JSON.stringify([comp1, comp2])
    it('Should make the `isFetching` state false.', () => {
      const state = reducer(undefined, listComponentsAction(comp1JSON))
      expect(state.isFetching).to.be.false
    })

    it('Should properly set the `serviceComponents` state.', () => {
      let state = reducer(undefined, listComponentsAction(comp1JSON))
      expect(state.serviceComponents).to.deep.equal([comp1])

      state = reducer(undefined, listComponentsAction(comp12JSON))
      expect(state.serviceComponents).to.deep.equal([comp1, comp2])
    })
  })

  describe('(Reducer)', () => {
    it('Should be a function.', () => {
      expect(reducer).to.be.a('function')
    })

    it('Should initialize states.', () => {
      const initialState = reducer(undefined, {})
      expect(initialState.isFetching).to.equal(false)
      expect(initialState.serviceComponents).to.be.empty
    })

    it('Should return the previous state if an action was not matched.', () => {
      const state = { isFetching: true, serviceComponents: [1] }
      let returnedState = reducer(state, {})
      expect(state.isFetching).to.equal(returnedState.isFetching)
      expect(state.serviceComponents).to.equal(returnedState.serviceComponents)
    })
  })
})
