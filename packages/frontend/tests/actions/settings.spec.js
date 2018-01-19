import fetchMock from 'fetch-mock'
import {
  LIST_SETTINGS,
  EDIT_SETTINGS,
  EDIT_LOGO,
  ADD_API_KEY,
  REMOVE_API_KEY,
  fetchSettings,
  fetchPublicSettings,
  updateSettings,
  postApiKey,
  deleteApiKey,
  uploadLogo,
  readImageFile
} from 'actions/settings'

describe('Actions/Settings', () => {
  const settings = {
    adminPageURL: 'admin',
    statusPageURL: 'status',
    serviceName: 'service',
    apiKeys: [{id: '1', value: '1'}, {id: '2', value: '2'}]
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

  describe('fetchSettings', () => {
    it('should return a function.', () => {
      assert(typeof fetchSettings() === 'function')
    })

    it('should fetch settings.', () => {
      fetchMock.get(/.*\/settings/, { body: settings, headers: {'Content-Type': 'application/json'} })

      return fetchSettings(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_SETTINGS)
          assert.deepEqual(settings, dispatchSpy.firstCall.args[0].settings)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.get(/.*\/settings/, { status: 400, body: {} })

      return fetchSettings(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('fetchPublicSettings', () => {
    it('should return a function.', () => {
      assert(typeof fetchPublicSettings() === 'function')
    })

    it('should fetch public settings.', () => {
      fetchMock.get(/.*\/public-settings/, { body: settings, headers: {'Content-Type': 'application/json'} })

      return fetchPublicSettings(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === LIST_SETTINGS)
          assert.deepEqual(settings, dispatchSpy.firstCall.args[0].settings)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.get(/.*\/public-settings/, { status: 400, body: {} })

      return fetchPublicSettings(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('updateSettings', () => {
    it('should return a function.', () => {
      assert(typeof updateSettings() === 'function')
    })

    it('should update the existing settings.', () => {
      fetchMock.patch(/.*\/settings/, { body: settings, headers: {'Content-Type': 'application/json'} })

      return updateSettings('', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === EDIT_SETTINGS)
          assert.deepEqual(settings, dispatchSpy.firstCall.args[0].settings)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.patch(/.*\/settings/, { status: 400, body: {} })

      return updateSettings('', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('postApiKey', () => {
    it('should return a function.', () => {
      assert(typeof postApiKey() === 'function')
    })

    it('should call POST apikeys.', () => {
      fetchMock.post(/.*\/settings\/apikeys/,
                     { body: settings.apiKeys[0], headers: {'Content-Type': 'application/json'} })

      return postApiKey(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === ADD_API_KEY)
          assert.deepEqual(settings.apiKeys[0], dispatchSpy.firstCall.args[0].apiKey)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.post(/.*\/settings\/apikeys/, { status: 400, body: {} })

      return postApiKey(callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('deleteApiKey', () => {
    it('should return a function.', () => {
      assert(typeof deleteApiKey() === 'function')
    })

    it('should call DELETE apikey.', () => {
      fetchMock.delete(/.*\/settings\/apikeys\/.*/, 204)
      const id = settings.apiKeys[0].id

      return deleteApiKey(id, callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(callbacks.onSuccess.calledOnce)
          assert(!callbacks.onFailure.called)

          assert(dispatchSpy.firstCall.args[0].type === REMOVE_API_KEY)
          assert.deepEqual(id, dispatchSpy.firstCall.args[0].keyID)
        })
    })

    it('should handle error properly.', () => {
      fetchMock.delete(/.*\/settings\/apikeys\/.*/, { status: 400, body: {} })

      return deleteApiKey('', callbacks)(dispatchSpy)
        .then(() => {
          assert(callbacks.onLoad.calledOnce)
          assert(!callbacks.onSuccess.called)
          assert(callbacks.onFailure.calledOnce)

          assert(!dispatchSpy.called)
        })
    })
  })

  describe('uploadLogo', () => {
    it('should return a function.', () => {
      assert(typeof uploadLogo() === 'function')
    })

    it('should upload a logo file.', async () => {
      fetchMock.post(/.*\/settings\/logos/, { body: {id: '1'}, headers: {'Content-Type': 'application/json'} })

      const file = new File([''], 'image.png', {type: 'image/png'})
      await uploadLogo(file, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === EDIT_LOGO)
      assert(settings, dispatchSpy.firstCall.args[0].id === '1')
    })

    it('should handle error properly.', async () => {
      fetchMock.post(/.*\/settings\/logos/, { status: 400, body: {} })

      const file = new File([''], 'image.png', {type: 'image/png'})
      await uploadLogo(file, callbacks)(dispatchSpy)
      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)
    })
  })

  describe('readImageFile', () => {
    it('should read an image file.', async () => {
      const expect = 'test'
      const file = new File([expect], 'image.png', {type: 'image/png'})
      const actual = await readImageFile(file)
      assert(actual === 'data:image/png;base64,dGVzdA==')
    })

    it('should return error for non image file.', async () => {
      const expect = 'test'
      const file = new File([expect], 'image.txt', {type: 'text/plain'})
      let err
      try {
        await readImageFile(file)
      } catch (e) {
        err = e
      }
      assert(err !== undefined)
    })
  })
})
