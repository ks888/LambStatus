import AWS from 'aws-sdk'

export class AdminUserPool {
  constructor ({userPoolName, serviceName, adminPageURL, snsCallerArn}) {
    this.cognito = new Cognito()

    this.userPoolName = userPoolName
    this.serviceName = serviceName
    this.adminPageURL = adminPageURL
    this.snsCallerArn = snsCallerArn
  }

  // TODO: retrieve serviceName and adminPageURL from the fetched user pool attributes.
  static async get (poolID, {serviceName, adminPageURL} = {}) {
    const rawUserPool = await new Cognito().getUserPool(poolID)

    const adminUserPool = new AdminUserPool({
      userPoolName: rawUserPool.Name,
      serviceName: serviceName,
      adminPageURL: adminPageURL,
      snsCallerArn: rawUserPool.SmsConfiguration.SnsCallerArn
    })
    adminUserPool.userPoolID = rawUserPool.Id
    return adminUserPool
  }

  async create () {
    const params = this.buildCommonParameters()
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

    this.userPoolID = await this.cognito.createUserPool(params)
    return this.userPoolID
  }

  async update () {
    const params = this.buildCommonParameters()
    if (this.userPoolID === undefined) {
      throw new Error('user pool id is not defined')
    }
    params.UserPoolId = this.userPoolID

    await this.cognito.updateUserPool(params)
  }

  async delete () {
    if (this.userPoolID === undefined) {
      throw new Error('user pool id is not defined')
    }

    const params = {
      UserPoolId: this.userPoolID
    }
    await this.cognito.deleteUserPool(params)
  }

  buildCommonParameters () {
    const {serviceName, adminPageURL, snsCallerArn} = this
    let title = `LambStatus`
    if (serviceName !== undefined && serviceName !== '') {
      title = `${serviceName} status`
    }
    const params = {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        UnusedAccountValidityDays: 7,
        InviteMessageTemplate: {
          EmailSubject: `${title} - Your temporary password`,
          EmailMessage: `Your username is {username} and temporary password is {####}. Access ${adminPageURL} and sign in to admin console.`
        }
      },
      AutoVerifiedAttributes: ['email'],
      EmailVerificationSubject: `${title} - Your verification code`,
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
        resolve(result.UserPool)
      })
    })
  }

  createUserPool (params) {
    return new Promise((resolve, reject) => {
      this.awsCognito.createUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result.UserPool.Id)
      })
    })
  }

  updateUserPool (params) {
    return new Promise((resolve, reject) => {
      this.awsCognito.updateUserPool(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  deleteUserPool (params) {
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

  signUp (clientId, subscriber) {
    const params = {
      ClientId: clientId,
      Username: subscriber.username,
      Password: subscriber.password,
      UserAttributes: [
        {Name: 'email', Value: subscriber.email},
        {Name: 'custom:token', Value: subscriber.token}
      ]
    }

    return new Promise((resolve, reject) => {
      this.awsCognito.signUp(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  confirm (clientId, username, code) {
    const params = {
      ClientId: clientId,
      ConfirmationCode: code,
      Username: username
    }

    return new Promise((resolve, reject) => {
      this.awsCognito.confirmSignUp(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  getUser (userPoolId, username) {
    const params = {
      UserPoolId: userPoolId,
      Username: username
    }

    return new Promise((resolve, reject) => {
      this.awsCognito.adminGetUser(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  getUserByEmailAddress (userPoolId, emailAddress) {
    const params = {
      UserPoolId: userPoolId,
      AttributesToGet: [],
      Filter: `email = "${emailAddress}"`,
      Limit: 1
    }

    return new Promise((resolve, reject) => {
      this.awsCognito.listUsers(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        if (data.Users.length !== 1) {
          return reject(new Error('matched unexpected number of users:', emailAddress))
        }
        resolve(data.Users[0])
      })
    })
  }

  async listUsers (userPoolId) {
    let paginationToken
    let users = []
    while (true) {
      const data = await this.listUsersWithPagination(userPoolId, paginationToken)
      users = users.concat(data.Users)

      if (data.PaginationToken === undefined) {
        break
      }
      paginationToken = data.PaginationToken
    }
    return users.filter(user => user.Enabled)
  }

  listUsersWithPagination (userPoolId, paginationToken) {
    const maxUsersPerRequest = 60
    const params = {
      UserPoolId: userPoolId,
      AttributesToGet: ['email', 'custom:token'],
      Filter: 'cognito:user_status = "CONFIRMED"',
      Limit: maxUsersPerRequest,
      PaginationToken: paginationToken
    }

    return new Promise((resolve, reject) => {
      this.awsCognito.listUsers(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
  }

  deleteUser (userPoolId, username) {
    const params = {
      UserPoolId: userPoolId,
      Username: username
    }

    return new Promise((resolve, reject) => {
      this.awsCognito.adminDeleteUser(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }
}
