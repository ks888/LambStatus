import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'
import { CALL_HISTORY_METHOD } from 'react-router-redux'
import {
  GET_USER,
  signin,
  fetchUser,
  setNewPassword,
  isAuthorized,
  signout,
  forgotPassword,
  setCodeAndPassword
} from 'actions/users'

describe('Actions/Users', () => {
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
    it('should return a function.', () => {
      assert(typeof signin() === 'function')
    })

    it('should sign in.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(callbacks.onFailure.notCalled)
      assert(callbacks.onNewPasswordRequested.notCalled)

      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert.deepEqual({username: 'inami'}, dispatchSpy.firstCall.args[0].user)
      assert(dispatchSpy.secondCall.args[0].type === CALL_HISTORY_METHOD)

      CognitoUser.prototype.authenticateUser.restore()
    })

    it('should handle signin error.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.onFailure({message: '', stack: ''})
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.notCalled)
      assert(callbacks.onFailure.calledOnce)
      assert(callbacks.onNewPasswordRequested.notCalled)

      assert(dispatchSpy.notCalled)

      CognitoUser.prototype.authenticateUser.restore()
    })

    it('should set new password.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.newPasswordRequired()
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.notCalled)
      assert(callbacks.onFailure.notCalled)
      assert(callbacks.onNewPasswordRequested.calledOnce)

      assert(dispatchSpy.notCalled)

      CognitoUser.prototype.authenticateUser.restore()
    })

    it('should show error if the new password callback is not given.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.newPasswordRequired()
      })
      signin('inami', undefined, {
        ...callbacks,
        onNewPasswordRequested: undefined
      })(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.notCalled)
      assert(callbacks.onFailure.calledOnce)

      assert(dispatchSpy.notCalled)

      CognitoUser.prototype.authenticateUser.restore()
    })
  })

  describe('setNewPassword', () => {
    it('should set a new password.', () => {
      sinon.stub(CognitoUser.prototype, 'completeNewPasswordChallenge', (newPassword, userAttrs, callbacks) => {
        callbacks.onSuccess()
      })
      const userName = '1'
      const user = new CognitoUser({Username: userName, Pool: {}})
      setNewPassword(dispatchSpy, user, 'newPassword', callbacks)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.called)
      assert(callbacks.onFailure.notCalled)

      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert(userName === dispatchSpy.firstCall.args[0].user.username)
      assert(dispatchSpy.secondCall.args[0].type === CALL_HISTORY_METHOD)

      CognitoUser.prototype.completeNewPasswordChallenge.restore()
    })

    it('should handle set password error.', () => {
      sinon.stub(CognitoUser.prototype, 'completeNewPasswordChallenge', (newPassword, userAttrs, callbacks) => {
        callbacks.onFailure(new Error(''))
      })
      const userName = '1'
      const user = new CognitoUser({Username: userName, Pool: {}})
      setNewPassword(dispatchSpy, user, 'newPassword', callbacks)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.notCalled)
      assert(callbacks.onFailure.called)

      assert(dispatchSpy.notCalled)

      CognitoUser.prototype.completeNewPasswordChallenge.restore()
    })
  })

  describe('fetchUser', () => {
    it('should return a function.', () => {
      assert(typeof fetchUser() === 'function')
    })

    it('should fetch a user.', () => {
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
    it('should call callback(true) if a user is valid.', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return { username: 'inami', getSession: (cb) => { cb(null, {}) } }
      })

      const callback = sinon.spy()
      isAuthorized(callback)
      assert(callback.firstCall.args[0])

      CognitoUserPool.prototype.getCurrentUser.restore()
    })

    it('should call callback(false) if a user is invalid.', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return { username: 'inami', getSession: (cb) => { cb(new Error('')) } }
      })

      const callback = sinon.spy()
      isAuthorized(callback)
      assert(callback.firstCall.args[0] === false)

      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('signout', () => {
    it('should return a function.', () => {
      assert(typeof signout() === 'function')
    })

    it('should call signOut().', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return new CognitoUser({Username: '', Pool: ''})
      })
      const signOutStub = sinon.stub(CognitoUser.prototype, 'signOut', () => {})

      signout()(dispatchSpy)

      assert(signOutStub.calledOnce)
      assert(dispatchSpy.firstCall.args[0].type === GET_USER)
      assert.deepEqual({username: ''}, dispatchSpy.firstCall.args[0].user)
      assert(dispatchSpy.secondCall.args[0].type === CALL_HISTORY_METHOD)

      CognitoUser.prototype.signOut.restore()
      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('forgotPassword', () => {
    it('should return a function.', () => {
      assert(typeof forgotPassword() === 'function')
    })

    it('should call forgotPassword().', () => {
      sinon.stub(CognitoUser.prototype, 'forgotPassword', (authCallbacks) => {
        authCallbacks.onSuccess()
      })
      forgotPassword('inami', callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(callbacks.onFailure.notCalled)

      CognitoUser.prototype.forgotPassword.restore()
    })

    it('should handle forgotPassword() error.', () => {
      sinon.stub(CognitoUser.prototype, 'forgotPassword', (authCallbacks) => {
        authCallbacks.onFailure(new Error(''))
      })
      forgotPassword('inami', callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.notCalled)
      assert(callbacks.onFailure.calledOnce)

      CognitoUser.prototype.forgotPassword.restore()
    })
  })

  describe('setCodeAndPassword', () => {
    it('should return a function.', () => {
      assert(typeof setCodeAndPassword() === 'function')
    })

    it('should call confirmPassword().', () => {
      sinon.stub(CognitoUser.prototype, 'confirmPassword', (code, password, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      setCodeAndPassword(undefined, 'inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.calledOnce)
      assert(callbacks.onFailure.notCalled)

      CognitoUser.prototype.confirmPassword.restore()
    })

    it('should handle confirmPassword() error.', () => {
      sinon.stub(CognitoUser.prototype, 'confirmPassword', (code, password, authCallbacks) => {
        authCallbacks.onFailure(new Error(''))
      })
      setCodeAndPassword(undefined, 'inami', undefined, callbacks)(dispatchSpy)

      assert(callbacks.onLoad.calledOnce)
      assert(callbacks.onSuccess.notCalled)
      assert(callbacks.onFailure.calledOnce)

      CognitoUser.prototype.confirmPassword.restore()
    })
  })
})
