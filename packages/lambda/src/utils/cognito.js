import AWS from 'aws-sdk'

export const createUserPool = (region, poolName, snsCallerArn) => {
  const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region })
  const params = {
    PoolName: poolName,
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: true,
      UnusedAccountValidityDays: 7
    },
    AliasAttributes: ['email'],
    AutoVerifiedAttributes: ['email'],
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
    cognito.createUserPool(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}
