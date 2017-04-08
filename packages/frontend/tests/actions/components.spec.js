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
      assert(typeof fetchComponents() === 'function')
    })

    it('Should fetch components.', () => {
      fetchMock.get(/.*\/components/, { body: [comp1], headers: {'Content-Type': 'application/json'} })

      return fetchComponents(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_COMPONENTS)
          assert.deepEqual([comp1], dispatchSpy.firstCall.args[0].components)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.get(/.*\/components/, { status: 400, body: {} })

      return fetchComponents(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('postComponent', () => {
    it('Should return a function.', () => {
      assert(typeof postComponent() === 'function')
    })

    it('Should post a new component.', () => {
      fetchMock.post(/.*\/components/, { body: comp1, headers: {'Content-Type': 'application/json'} })

      return postComponent(undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === ADD_COMPONENT)
          assert.deepEqual(comp1, dispatchSpy.firstCall.args[0].component)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.post(/.*\/components/, { status: 400, body: {} })

      return postComponent(undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('updateComponent', () => {
    it('Should return a function.', () => {
      assert(typeof updateComponent() === 'function')
    })

    it('Should update the existing component.', () => {
      fetchMock.patch(/.*\/components\/.*/, { body: comp1, headers: {'Content-Type': 'application/json'} })

      return updateComponent('c1', undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === EDIT_COMPONENT)
          assert.deepEqual(comp1, dispatchSpy.firstCall.args[0].component)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.patch(/.*\/components\/.*/, { status: 400, body: {} })

      return updateComponent('c1', undefined, undefined, undefined, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('deleteComponent', () => {
    it('Should return a function.', () => {
      assert(typeof deleteComponent() === 'function')
    })

    it('Should delete the component.', () => {
      fetchMock.delete(/.*\/components\/.*/, 204)

      return deleteComponent('c1', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === REMOVE_COMPONENT)
          assert.deepEqual('c1', dispatchSpy.firstCall.args[0].componentID)
        })
    })

    it('Should handle error properly.', () => {
      fetchMock.delete(/.*\/components\/.*/, { status: 400, body: {} })

      return deleteComponent('c1', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })
})
