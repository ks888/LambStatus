import fetchMock from 'fetch-mock'
import {
  LIST_COMPONENTS,
  listComponents,
  fetchComponents
} from 'actions/components'

describe('(Action) components', () => {
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

  describe('listComponents', () => {
    it('Should be exported as a function.', () => {
      expect(listComponents).to.be.a('function')
    })

    it('Should return an action with type "LIST_COMPONENTS"', () => {
      const action = listComponents("json")
      expect(action).to.have.property('type', LIST_COMPONENTS)
      expect(action).to.have.property('components', "json")
    })
  })

  describe('fetchComponents', () => {
    let globalState, dispatchSpy

    beforeEach(() => {
      dispatchSpy = sinon.spy(() => {})

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

    it('Should call onLoad callback.', () => {
      const onLoadCallback = sinon.spy()
      return fetchComponents({ onLoad: onLoadCallback })(dispatchSpy)
        .then(() => {
          expect(onLoadCallback.calledOnce).to.be.true
        })
    })

    it('Should dispatch LIST_COMPONENTS action.', () => {
      return fetchComponents()(dispatchSpy)
        .then(() => {
          expect(dispatchSpy.firstCall.args[0].type).to.equal(LIST_COMPONENTS)
          expect(dispatchSpy.firstCall.args[0].components).to.deep.equal([comp1])
        })
    })
  })
})
