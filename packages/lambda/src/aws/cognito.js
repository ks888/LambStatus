import AWS from 'aws-sdk'

export default class Cognito {
  constructor () {
    const { AWS_REGION: region } = process.env
    this.awsCognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region })
  }

  createUserPool (region, poolName, serviceName, adminPageURL, snsCallerArn) {
    const params = this.buildUserPoolParameters(serviceName, adminPageURL, snsCallerArn)
    params.PoolName = poolName
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
    return new Promise((resolve, reject) => {
      this.awsCognito.createUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  describeUserPool (poolID) {
    return new Promise((resolve, reject) => {
      this.awsCognito.describeUserPool({UserPoolId: poolID}, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.UserPool)
      })
    })
  }

  updateUserPool (poolID, serviceName, adminPageURL, snsCallerArn) {
    const params = this.buildUserPoolParameters(serviceName, adminPageURL, snsCallerArn)
    params.UserPoolId = poolID
    return new Promise((resolve, reject) => {
      this.awsCognito.updateUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  buildUserPoolParameters (serviceName, adminPageURL, snsCallerArn) {
    return {
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
