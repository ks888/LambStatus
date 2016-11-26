import fetchMock from 'fetch-mock'
import {
  SET_STATUS,
  LIST_COMPONENTS,
  setStatusAction,
  listComponentsAction,
  fetchComponents,
  default as reducer
} from 'routes/Components/modules/components'
import { requestStatus } from 'utils/status'

describe('(Redux Module) Components', () => {
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

  describe('(Action Creator) setStatusAction', () => {
    it('Should be exported as a function.', () => {
      expect(setStatusAction).to.be.a('function')
    })

    it('Should return an action with type "SET_STATUS".', () => {
      const action = setStatusAction({loadStatus: 0})
      expect(action).to.have.property('type', SET_STATUS)
      expect(action.status).to.have.property('loadStatus', 0)
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

    it('Should dispatch load action first.', () => {
      return fetchComponents()(_dispatchSpy)
        .then(() => {
          expect(_dispatchSpy.firstCall.args[0].type).to.equal(SET_STATUS)
          expect(_dispatchSpy.firstCall.args[0].status.loadStatus).to.equal(requestStatus.inProgress)
        })
    })

    it('Should dispatch list action next.', () => {
      return fetchComponents()(_dispatchSpy)
        .then(() => {
          expect(_dispatchSpy.secondCall.args[0].type).to.equal(LIST_COMPONENTS)
          expect(_dispatchSpy.secondCall.args[0].serviceComponents).to.deep.equal([comp1])
        })
    })
  })

  describe('(Action Handler) SET_STATUS Handler', () => {
    it('Should set values in action.status.', () => {
      const state = reducer(undefined, setStatusAction({loadStatus: 0}))
      expect(state.loadStatus).to.equal(0)
    })
  })

  describe('(Action Handler) LIST_COMPONENTS Handler', () => {
    const comp1JSON = JSON.stringify([comp1])
    const comp12JSON = JSON.stringify([comp1, comp2])
    it('Should set the `loadStatus` state success.', () => {
      const state = reducer(undefined, listComponentsAction(comp1JSON))
      expect(state.loadStatus).to.equal(requestStatus.success)
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
      expect(initialState.loadStatus).to.equal(requestStatus.none)
      expect(initialState.updateStatus).to.equal(requestStatus.none)
      expect(initialState.serviceComponents).to.be.empty
    })

    it('Should return the previous state if an action was not matched.', () => {
      const state = {
        loadStatus: requestStatus.loading,
        updateStatus: requestStatus.loading,
        serviceComponents: [1]
      }
      let returnedState = reducer(state, {})
      expect(requestStatus.loadStatus).to.equal(state.loadStatus)
      expect(requestStatus.updateStatus).to.equal(state.updateStatus)
      expect(state.serviceComponents).to.equal(returnedState.serviceComponents)
    })
  })
})
