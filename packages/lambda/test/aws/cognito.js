import assert from 'assert'
import AWS from 'aws-sdk-mock'
import Cognito, { UserPool } from 'aws/cognito'

describe('UserPool', () => {
  context('buildCommonUserPoolParameters', () => {
    it('should build user pool params', async () => {
      const params = {serviceName: 'name', adminPageURL: 'url', snsCallerArn: 'arn'}
      const userPool = new UserPool(params)
      const actual = userPool.buildCommonUserPoolParameters()

      assert(actual.EmailVerificationSubject.match(new RegExp(params.serviceName)))
      assert(actual.AdminCreateUserConfig.InviteMessageTemplate.EmailMessage.match(new RegExp(params.adminPageURL)))
      assert(actual.SmsConfiguration.SnsCallerArn === params.snsCallerArn)
    })
  })
})

describe('Cognito', () => {
  afterEach(() => {
    AWS.restore('CognitoIdentityServiceProvider')
  })

  context('getUserPool', () => {
    it('should call describeUserPool', async () => {
      const rawOutput = {UserPool: {Id: 'id', Name: 'name', SmsConfiguration: {SnsCallerArn: 'arn'}}}
      const input = 'id'
      AWS.mock('CognitoIdentityServiceProvider', 'describeUserPool', (params, callback) => {
        assert(params.UserPoolId === input)
        callback(null, rawOutput)
      })

      const cognito = new Cognito()
      const userPool = await cognito.getUserPool(input)
      assert(userPool.userPoolID === rawOutput.UserPool.Id)
      assert(userPool.userPoolName === rawOutput.UserPool.Name)
      assert(userPool.snsCallerArn === rawOutput.UserPool.SmsConfiguration.SnsCallerArn)
    })
  })

  context('createUserPool', () => {
    it('should call createUserPool', async () => {
      const input = {userPoolName: 'name', serviceName: 'test', adminPageURL: 'url', snsCallerArn: 'arn'}
      const id = 'id'
      AWS.mock('CognitoIdentityServiceProvider', 'createUserPool', (params, callback) => {
        assert(params.PoolName === input.userPoolName)
        callback(null, {UserPool: {Id: id, Name: params.PoolName}})
      })

      let err, actual
      try {
        const cognito = new Cognito()
        const userPool = new UserPool(input)
        actual = await cognito.createUserPool(userPool)
      } catch (error) {
        err = error
      }

      assert(err === undefined)
      assert(actual instanceof UserPool)
      assert(actual.userPoolID === id)
    })
  })

  context('updateUserPool', () => {
    it('should call updateUserPool', async () => {
      const input = {userPoolId: 'id', serviceName: 'test', adminPageURL: 'url', snsCallerArn: 'arn'}

      AWS.mock('CognitoIdentityServiceProvider', 'updateUserPool', (params, callback) => {
        assert(params.UserPoolId === input.userPoolId)
        callback(null)
      })

      let err
      try {
        const cognito = new Cognito()
        const userPool = new UserPool(input)
        await cognito.updateUserPool(userPool)
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
        await cognito.deleteUserPool(input)
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
})
