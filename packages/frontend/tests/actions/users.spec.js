import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import { CALL_HISTORY_METHOD } from 'react-router-redux'
import {
  GET_USER,
  signin,
  fetchUser,
  isAuthorized,
  signout,
  forgotPassword,
  setCodeAndPassword
} from 'actions/users'

describe('(Action) users', () => {
  let dispatchSpy, callbacks

  beforeEach(() => {
    dispatchSpy = sinon.spy(() => {})
    callbacks = {
      onLoad: sinon.spy(),
      onSuccess: sinon.spy(),
      onFailure: sinon.spy(),
      onNewPasswordRequested: sinon.spy()
    }
  })

  describe('signin', () => {
    it('Should return a function.', () => {
      assert(typeof signin() === 'function')
    })

    it('Should sign in.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)
      assert(!callbacks.onNewPasswordRequested.called)

      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert.deepEqual({username: 'inami'}, dispatchSpy.firstCall.args[0].user)
      assert(dispatchSpy.secondCall.args[0].type === CALL_HISTORY_METHOD)

      CognitoUser.prototype.authenticateUser.restore()
    })

    it('Should handle signin error.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.onFailure({message: '', stack: ''})
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(!callbacks.onSuccess.called)
      assert(callbacks.onFailure.calledOnce)

      assert(!dispatchSpy.called)

      CognitoUser.prototype.authenticateUser.restore()
    })

    it('Should set new password.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.newPasswordRequired()
      })
      sinon.stub(CognitoUser.prototype, 'completeNewPasswordChallenge', (newPassword, _, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      signin('inami', undefined, {
        onLoad: callbacks.onLoad,
        onSuccess: callbacks.onSuccess,
        onFailure: callbacks.onFailure,
        onNewPasswordRequested: (cb) => { cb(undefined, callbacks) }
      })(dispatchSpy)

      assert(callbacks.onLoad.calledTwice)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert.deepEqual({username: 'inami'}, dispatchSpy.firstCall.args[0].user)
      assert(dispatchSpy.secondCall.args[0].type === CALL_HISTORY_METHOD)

      CognitoUser.prototype.completeNewPasswordChallenge.restore()
      CognitoUser.prototype.authenticateUser.restore()
    })
  })

  describe('fetchUser', () => {
    it('Should return a function.', () => {
      assert(typeof fetchUser() === 'function')
    })

    it('Should fetch a user.', () => {
      const user = {username: 'inami'}
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return user
      })

      fetchUser()(dispatchSpy)

      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert.deepEqual(user, dispatchSpy.firstCall.args[0].user)

      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('isAuthorized', () => {
    it('Should authorize a right user.', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return { username: 'inami', getSession: (cb) => { cb() } }
      })

      const callback = sinon.spy()
      isAuthorized(callback)
      assert(callback.firstCall.args[0])

      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('signout', () => {
    it('Should return a function.', () => {
      assert(typeof signout() === 'function')
    })

    it('Should sign out.', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return new CognitoUser({Username: '', Pool: ''})
      })
      const signOutMock = sinon.mock(CognitoUser.prototype)
      signOutMock.expects('signOut').once()

      signout()(dispatchSpy)

      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert.deepEqual({username: ''}, dispatchSpy.firstCall.args[0].user)
      assert(dispatchSpy.secondCall.args[0].type === CALL_HISTORY_METHOD)

      signOutMock.verify()
      signOutMock.restore()
      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('forgotPassword', () => {
    it('Should return a function.', () => {
      assert(typeof forgotPassword() === 'function')
    })

    it('Should forgot password.', () => {
      sinon.stub(CognitoUser.prototype, 'forgotPassword', (authCallbacks) => {
        authCallbacks.onSuccess()
      })
      forgotPassword('inami', callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      CognitoUser.prototype.forgotPassword.restore()
    })
  })

  describe('setCodeAndPassword', () => {
    it('Should return a function.', () => {
      assert(typeof setCodeAndPassword() === 'function')
    })

    it('Should set code and new password.', () => {
      sinon.stub(CognitoUser.prototype, 'confirmPassword', (code, password, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      setCodeAndPassword(undefined, 'inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(!callbacks.onFailure.called)

      CognitoUser.prototype.confirmPassword.restore()
    })
  })
})
