import fetchMock from 'fetch-mock'
import {
  LIST_COMPONENTS,
  ADD_COMPONENT,
  EDIT_COMPONENT,
  REMOVE_COMPONENT,
  fetchComponents,
  postComponent,
  updateComponent,
  deleteComponent
} from 'actions/components'

describe('(Action) components', () => {
  const comp1 = {
    componentID: 'compID1',
    name: 'name1',
    description: 'desc1',
    status: 'status1',
    order: 0
  }

  let dispatchSpy, callbacks

  beforeEach(() => {
    dispatchSpy = sinon.spy(() => {})
    callbacks = {
      onLoad: sinon.spy(),
      onSuccess: sinon.spy(),
      onFailure: sinon.spy()
    }
  })

  afterEach(() => {
    fetchMock.restore()
  })

  describe('fetchComponents', () => {
    it('Should return a function.', () => {
      expect(fetchComponents()).to.be.a('function')
    })

    it('Should fetch components.', () => {
      fetchMock.get(/.*\/components/, { body: [comp1] })

      return fetchComponents(callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(LIST_COMPONENTS)
          expect(dispatchSpy.firstCall.args[0].components).to.deep.equal([comp1])
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.get(/.*\/components/, { status: 400, body: {} })

      return fetchComponents(callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('postComponent', () => {
    it('Should return a function.', () => {
      expect(postComponent()).to.be.a('function')
    })

    it('Should post a new component.', () => {
      fetchMock.post(/.*\/components/, { body: comp1 })

      return postComponent(undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(ADD_COMPONENT)
          expect(dispatchSpy.firstCall.args[0].component).to.deep.equal(comp1)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.post(/.*\/components/, { status: 400, body: {} })

      return postComponent(undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('updateComponent', () => {
    it('Should return a function.', () => {
      expect(updateComponent()).to.be.a('function')
    })

    it('Should update the existing component.', () => {
      fetchMock.patch(/.*\/components\/.*/, { body: comp1 })

      return updateComponent('c1', undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(EDIT_COMPONENT)
          expect(dispatchSpy.firstCall.args[0].component).to.deep.equal(comp1)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.patch(/.*\/components\/.*/, { status: 400, body: {} })

      return updateComponent('c1', undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })

  describe('deleteComponent', () => {
    it('Should return a function.', () => {
      expect(deleteComponent()).to.be.a('function')
    })

    it('Should delete the component.', () => {
      fetchMock.delete(/.*\/components\/.*/, {})

      return deleteComponent('c1', callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.calledOnce).to.be.true
          expect(callbacks.onFailure.called).to.be.false

          expect(dispatchSpy.firstCall.args[0].type).to.equal(REMOVE_COMPONENT)
          expect(dispatchSpy.firstCall.args[0].componentID).to.equal('c1')
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.delete(/.*\/components\/.*/, { status: 400, body: {} })

      return deleteComponent('c1', callbacks)(dispatchSpy)
        .then(() => {
          expect(callbacks.onLoad.calledOnce).to.be.true
          expect(callbacks.onSuccess.called).to.be.false
          expect(callbacks.onFailure.calledOnce).to.be.true

          expect(dispatchSpy.called).to.be.false
        })
    })
  })
})
