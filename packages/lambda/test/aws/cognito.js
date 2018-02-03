import assert from 'assert'
import sinon from 'sinon'
import AWS from 'aws-sdk-mock'
import Cognito, { AdminUserPool } from 'aws/cognito'
import { Subscriber } from 'model/subscription'

describe('UserPool', () => {
  afterEach(() => {
    AWS.restore('CognitoIdentityServiceProvider')
  })

  context('get', () => {
    it('should build the pool object from the fetched user pool info', async () => {
      const id = 'id'
      const serviceName = 'test'
      const adminPageURL = 'url'
      const userPoolName = 'name'
      const snsCallerArn = 'arn'

      sinon.stub(Cognito.prototype, 'getUserPool', (poolID) => {
        assert(poolID === id)
        return {Id: poolID, Name: userPoolName, SmsConfiguration: {SnsCallerArn: snsCallerArn}}
      })

      const actual = await AdminUserPool.get(id, {serviceName, adminPageURL})
      assert(actual.userPoolID === id)
      assert(actual.userPoolName === userPoolName)
      assert(actual.serviceName === serviceName)
      assert(actual.snsCallerArn === snsCallerArn)
      assert(actual.adminPageURL === adminPageURL)
    })
  })

  context('create', () => {
    it('should create the admin page pool from the given args', async () => {
      const id = 'id'
      const userPoolName = 'name'

      const stub = sinon.stub(Cognito.prototype, 'createUserPool', (params) => {
        assert(params.PoolName === userPoolName)
        return id
      })

      const pool = new AdminUserPool({userPoolName})
      await pool.create()
      assert(pool.userPoolID === id)
      assert(stub.calledOnce)
    })
  })

  context('update', () => {
    it('should update the admin page pool', async () => {
      const id = 'id'

      const stub = sinon.stub(Cognito.prototype, 'updateUserPool', (params) => {
        assert(params.UserPoolId === id)
      })

      let err
      try {
        const pool = new AdminUserPool({})
        pool.userPoolID = id
        await pool.update()
      } catch (error) {
        err = error
      }
      assert(err === undefined)
      assert(stub.calledOnce)
    })

    it('should throw error if id is not defined', async () => {
      let err
      try {
        const pool = new AdminUserPool({})
        await pool.update()
      } catch (error) {
        err = error
      }
      assert(err !== undefined)
    })
  })

  context('delete', () => {
    it('should delete the admin page pool', async () => {
      const id = 'id'

      const stub = sinon.stub(Cognito.prototype, 'deleteUserPool', (params) => {
        assert(params.UserPoolId === id)
      })

      let err
      try {
        const pool = new AdminUserPool({})
        pool.userPoolID = id
        await pool.delete()
      } catch (error) {
        err = error
      }
      assert(err === undefined)
      assert(stub.calledOnce)
    })

    it('should throw error if id is not defined', async () => {
      let err
      try {
        const pool = new AdminUserPool({})
        await pool.delete()
      } catch (error) {
        err = error
      }
      assert(err !== undefined)
    })
  })

  context('buildCommonParameters', () => {
    it('should build user pool params', async () => {
      const params = {serviceName: 'name', adminPageURL: 'url', snsCallerArn: 'arn'}
      const userPool = new AdminUserPool(params)
      const actual = userPool.buildCommonParameters()

      assert(actual.EmailVerificationSubject.match(new RegExp(params.serviceName)))
      assert(actual.AdminCreateUserConfig.InviteMessageTemplate.EmailMessage.match(new RegExp(params.adminPageURL)))
      assert(actual.SmsConfiguration.SnsCallerArn === params.snsCallerArn)
    })

    it('should set LambStatus as the title if service name is empty', async () => {
      const params = {serviceName: '', adminPageURL: 'url', snsCallerArn: 'arn'}
      const userPool = new AdminUserPool(params)
      const actual = userPool.buildCommonParameters()

      assert(actual.EmailVerificationSubject.match(new RegExp('LambStatus')))
    })
  })
})

describe('Cognito', () => {
  afterEach(() => {
    AWS.restore('CognitoIdentityServiceProvider')
  })

  context('getUserPool', () => {
    it('should call describeUserPool', async () => {
      const id = 'id'
      AWS.mock('CognitoIdentityServiceProvider', 'describeUserPool', (params, callback) => {
        assert(params.UserPoolId === id)
        callback(null, {UserPool: {Id: id}})
      })

      let err, actual
      try {
        actual = await new Cognito().getUserPool(id)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual.Id === id)
    })
  })

  context('createUserPool', () => {
    it('should call createUserPool', async () => {
      const userPoolName = 'name'
      const id = 'id'
      AWS.mock('CognitoIdentityServiceProvider', 'createUserPool', (params, callback) => {
        assert(params.PoolName === userPoolName)
        callback(null, {UserPool: {Id: id}})
      })

      let err, actual
      try {
        actual = await new Cognito().createUserPool({PoolName: userPoolName})
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual === id)
    })
  })

  context('updateUserPool', () => {
    it('should call updateUserPool', async () => {
      const id = 'id'
      AWS.mock('CognitoIdentityServiceProvider', 'updateUserPool', (params, callback) => {
        assert(params.UserPoolId === id)
        callback(null)
      })

      let err
      try {
        const cognito = new Cognito()
        await cognito.updateUserPool({UserPoolId: id})
      } catch (error) {
        err = error
      }

      assert(err === undefined)
    })
  })

  context('deleteUserPool', () => {
    it('should call deleteUserPool', async () => {
      const input = 'id'
      AWS.mock('CognitoIdentityServiceProvider', 'deleteUserPool', (params, callback) => {
        assert(params.UserPoolId === input)
        callback(null)
      })

      const cognito = new Cognito()
      let err
      try {
        await cognito.deleteUserPool({UserPoolId: input})
      } catch (error) {
        err = error
      }
      assert(err === undefined)
    })
  })

  context('createUserPoolClient', () => {
    it('should call createUserPoolClient', async () => {
      const userPoolID = 'id'
      const clientName = 'name'
      AWS.mock('CognitoIdentityServiceProvider', 'createUserPoolClient', (params, callback) => {
        assert(params.UserPoolId === userPoolID)
        assert(params.ClientName === clientName)
        callback(null, {UserPoolClient: {}})
      })

      const cognito = new Cognito()
      let err
      try {
        await cognito.createUserPoolClient(userPoolID, clientName)
      } catch (error) {
        err = error
      }
      assert(err === undefined)
    })
  })

  context('createUser', () => {
    it('should call adminCreateUser', async () => {
      const userPoolID = 'id'
      const userName = 'name'
      const email = 'mail'
      AWS.mock('CognitoIdentityServiceProvider', 'adminCreateUser', (params, callback) => {
        assert(params.UserPoolId === userPoolID)
        assert(params.Username === userName)
        assert(params.UserAttributes[0].Value === email)
        callback(null, {User: {}})
      })

      const cognito = new Cognito()
      let err
      try {
        await cognito.createUser(userPoolID, userName, email)
      } catch (error) {
        err = error
      }
      assert(err === undefined)
    })
  })

  context('signUp', () => {
    it('should call signUp', async () => {
      const clientID = 'id'
      const username = 'name'
      let actual
      AWS.mock('CognitoIdentityServiceProvider', 'signUp', (params, callback) => {
        actual = params
        callback(null, {User: {}})
      })

      const cognito = new Cognito()
      let err
      try {
        const subscriber = new Subscriber(username)
        await cognito.signUp(clientID, subscriber)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual.ClientId === clientID)
      assert(actual.Username.length === 12)
      assert(actual.Password !== undefined)
      assert(actual.UserAttributes.length === 2)
    })
  })
})
