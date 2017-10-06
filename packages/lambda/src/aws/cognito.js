import AWS from 'aws-sdk'

export class UserPool {
  constructor ({userPoolID, userPoolName, serviceName, adminPageURL, snsCallerArn}) {
    this.userPoolID = userPoolID
    this.userPoolName = userPoolName
    this.serviceName = serviceName
    this.adminPageURL = adminPageURL
    this.snsCallerArn = snsCallerArn
  }

  buildCreateUserPoolParameters () {
    const params = this.buildCommonUserPoolParameters()
    params.Schema = [{
      Name: 'email',
      StringAttributeConstraints: {
        MinLength: '0',
        MaxLength: '2048'
      },
      DeveloperOnlyAttribute: false,
      Required: true,
      AttributeDataType: 'String',
      Mutable: true
    }]
    params.AliasAttributes = ['email']
    params.PoolName = this.userPoolName

    return params
  }

  buildUpdateUserPoolParameters () {
    const params = this.buildCommonUserPoolParameters()
    params.UserPoolId = this.userPoolID

    return params
  }

  buildCommonUserPoolParameters () {
    const {serviceName, adminPageURL, snsCallerArn} = this
    const params = {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        UnusedAccountValidityDays: 7,
        InviteMessageTemplate: {
          EmailSubject: `${serviceName} StatusPage - Your temporary password`,
          EmailMessage: `Your username is {username} and temporary password is {####}. Access ${adminPageURL} and sign in to admin console.`
        }
      },
      AutoVerifiedAttributes: ['email'],
      EmailVerificationSubject: `${serviceName} StatusPage - Your verification code`,
      MfaConfiguration: 'OPTIONAL',
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireSymbols: false,
          RequireUppercase: true
        }
      },
      SmsConfiguration: {
        SnsCallerArn: snsCallerArn,
        ExternalId: snsCallerArn
      }
    }
    return params
  }
}

export default class Cognito {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsCognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region })
  }

  getUserPool (poolID) {
    return new Promise((resolve, reject) => {
      this.awsCognito.describeUserPool({UserPoolId: poolID}, (err, result) => {
        if (err) {
          return reject(err)
        }

        const userPoolID = result.UserPool.Id
        const userPoolName = result.UserPool.Name
        const snsCallerArn = result.UserPool.SmsConfiguration.SnsCallerArn
        const userPool = new UserPool({ userPoolID, userPoolName, snsCallerArn })
        resolve(userPool)
      })
    })
  }

  createUserPool (userPool) {
    const params = userPool.buildCreateUserPoolParameters()
    return new Promise((resolve, reject) => {
      this.awsCognito.createUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        const createdUserPool = new UserPool({
          userPoolID: result.UserPool.Id,
          userPoolName: result.UserPool.Name
        })
        resolve(createdUserPool)
      })
    })
  }

  updateUserPool (userPool) {
    const params = userPool.buildUpdateUserPoolParameters()
    return new Promise((resolve, reject) => {
      this.awsCognito.updateUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  deleteUserPool (userPoolID) {
    const params = {
      UserPoolId: userPoolID
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.deleteUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  createUserPoolClient (userPoolID, clientName) {
    const params = {
      UserPoolId: userPoolID,
      ClientName: clientName
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.createUserPoolClient(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.UserPoolClient)
      })
    })
  }

  createUser (userPoolId, userName, email) {
    const params = {
      UserPoolId: userPoolId,
      Username: userName,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {Name: 'email', Value: email},
        {Name: 'email_verified', Value: 'true'}
      ]
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.adminCreateUser(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.User)
      })
    })
  }
}
