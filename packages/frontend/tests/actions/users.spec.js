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
      expect(signin()).to.be.a('function')
    })

    it('Should sign in.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      expect(callbacks.onLoad.calledOnce).to.be.true
      expect(callbacks.onSuccess.calledOnce).to.be.true
      expect(callbacks.onFailure.called).to.be.false
      expect(callbacks.onNewPasswordRequested.called).to.be.false

      expect(dispatchSpy.firstCall.args[0].type).to.equal(GET_USER)
      expect(dispatchSpy.firstCall.args[0].user).to.deep.equal({username: 'inami'})
      expect(dispatchSpy.secondCall.args[0].type).to.equal(CALL_HISTORY_METHOD)

      CognitoUser.prototype.authenticateUser.restore()
    })

    it('Should handle signin error.', () => {
      sinon.stub(CognitoUser.prototype, 'authenticateUser', (auth, authCallbacks) => {
        authCallbacks.onFailure({message: '', stack: ''})
      })
      signin('inami', undefined, callbacks)(dispatchSpy)

      expect(callbacks.onLoad.calledOnce).to.be.true
      expect(callbacks.onSuccess.called).to.be.false
      expect(callbacks.onFailure.calledOnce).to.be.true

      expect(dispatchSpy.called).to.be.false

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

      expect(callbacks.onLoad.calledTwice).to.be.true
      expect(callbacks.onSuccess.calledOnce).to.be.true
      expect(callbacks.onFailure.called).to.be.false

      expect(dispatchSpy.firstCall.args[0].type).to.equal(GET_USER)
      expect(dispatchSpy.firstCall.args[0].user).to.deep.equal({username: 'inami'})
      expect(dispatchSpy.secondCall.args[0].type).to.equal(CALL_HISTORY_METHOD)

      CognitoUser.prototype.completeNewPasswordChallenge.restore()
      CognitoUser.prototype.authenticateUser.restore()
    })
  })

  describe('fetchUser', () => {
    it('Should return a function.', () => {
      expect(fetchUser()).to.be.a('function')
    })

    it('Should fetch a user.', () => {
      const user = {username: 'inami'}
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return user
      })

      fetchUser()(dispatchSpy)

      expect(dispatchSpy.firstCall.args[0].type).to.equal(GET_USER)
      expect(dispatchSpy.firstCall.args[0].user).to.deep.equal(user)

      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('isAuthorized', () => {
    it('Should authorize a right user.', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return {username: 'inami', getSession: (cb) => { cb() } }
      })

      const callback = sinon.spy()
      isAuthorized(callback)
      expect(callback.firstCall.args[0]).to.equal(true)

      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('signout', () => {
    it('Should return a function.', () => {
      expect(signout()).to.be.a('function')
    })

    it('Should sign out.', () => {
      sinon.stub(CognitoUserPool.prototype, 'getCurrentUser', () => {
        return new CognitoUser({Username: '', Pool: ''})
      })
      const signOutMock = sinon.mock(CognitoUser.prototype)
      signOutMock.expects('signOut').once()

      signout()(dispatchSpy)

      expect(dispatchSpy.firstCall.args[0].type).to.equal(GET_USER)
      expect(dispatchSpy.firstCall.args[0].user).to.deep.equal({username: ''})
      expect(dispatchSpy.secondCall.args[0].type).to.equal(CALL_HISTORY_METHOD)

      signOutMock.verify()
      signOutMock.restore()
      CognitoUserPool.prototype.getCurrentUser.restore()
    })
  })

  describe('forgotPassword', () => {
    it('Should return a function.', () => {
      expect(forgotPassword()).to.be.a('function')
    })

    it('Should forgot password.', () => {
      sinon.stub(CognitoUser.prototype, 'forgotPassword', (authCallbacks) => {
        authCallbacks.onSuccess()
      })
      forgotPassword('inami', callbacks)(dispatchSpy)

      expect(callbacks.onLoad.calledOnce).to.be.true
      expect(callbacks.onSuccess.calledOnce).to.be.true
      expect(callbacks.onFailure.called).to.be.false

      CognitoUser.prototype.forgotPassword.restore()
    })
  })

  describe('setCodeAndPassword', () => {
    it('Should return a function.', () => {
      expect(setCodeAndPassword()).to.be.a('function')
    })

    it('Should set code and new password.', () => {
      sinon.stub(CognitoUser.prototype, 'confirmPassword', (code, password, authCallbacks) => {
        authCallbacks.onSuccess()
      })
      setCodeAndPassword(undefined, 'inami', undefined, callbacks)(dispatchSpy)

      expect(callbacks.onLoad.calledOnce).to.be.true
      expect(callbacks.onSuccess.calledOnce).to.be.true
      expect(callbacks.onFailure.called).to.be.false

      CognitoUser.prototype.confirmPassword.restore()
    })
  })
})
