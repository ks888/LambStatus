import AWS from 'aws-sdk'

export default class Cognito {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsCognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region })
  }

  createUserPool (region, poolName, serviceName, adminPageURL, snsCallerArn) {
    const params = {
      PoolName: poolName,
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        UnusedAccountValidityDays: 7,
        InviteMessageTemplate: {
          EmailSubject: `${serviceName} StatusPage - Your temporary password`,
          EmailMessage: `Your username is {username} and temporary password is {####}. Access ${adminPageURL} and sign in to admin console.`
        }
      },
      AliasAttributes: ['email'],
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
      Schema: [{
        Name: 'email',
        StringAttributeConstraints: {
          MinLength: '0',
          MaxLength: '2048'
        },
        DeveloperOnlyAttribute: false,
        Required: true,
        AttributeDataType: 'String',
        Mutable: true
      }],
      SmsConfiguration: {
        SnsCallerArn: snsCallerArn,
        ExternalId: snsCallerArn
      }
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.createUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  updateUserPool (poolID, serviceName, adminPageURL) {
    const params = {
      UserPoolId: poolID,
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        UnusedAccountValidityDays: 7,
        InviteMessageTemplate: {
          EmailSubject: `${serviceName} StatusPage - Your temporary password`,
          EmailMessage: `Your username is {username} and temporary password is {####}. Access ${adminPageURL} and sign in to admin console.`
        }
      },
      EmailVerificationSubject: `${serviceName} StatusPage - Your verification code`
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.updateUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  deleteUserPool (region, userPoolID) {
    const params = {
      UserPoolId: userPoolID
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.deleteUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  createUserPoolClient (region, userPoolID, clientName) {
    const params = {
      UserPoolId: userPoolID,
      ClientName: clientName
    }
    return new Promise((resolve, reject) => {
      this.awsCognito.createUserPoolClient(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  createUser (region, userPoolId, userName, email) {
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
        resolve(result)
      })
    })
  }
}
