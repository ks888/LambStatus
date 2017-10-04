import { ValidationError } from 'utils/errors'

export class Settings {
  constructor ({serviceName, adminPageURL, statusPageURL, cognitoPoolID} = {}) {
    this.serviceName = serviceName
    this.adminPageURL = adminPageURL
    this.statusPageURL = statusPageURL
    this.cognitoPoolID = cognitoPoolID
  }

  validate (url) {
    // eslint-disable-next-line no-useless-escape, max-len
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null
  }

  async setServiceName (serviceName) {
    this.serviceName = serviceName
  }

  async getServiceName () {
    return this.serviceName
  }

  async setAdminPageURL (adminPageURL) {
    if (!this.validate(adminPageURL)) {
      throw new ValidationError('invalid url')
    }
    this.adminPageURL = adminPageURL
  }

  async getAdminPageURL () {
    return this.adminPageURL
  }

  async setStatusPageURL (statusPageURL) {
    if (!this.validate(statusPageURL)) {
      throw new ValidationError('invalid url')
    }
    this.statusPageURL = statusPageURL
  }

  async getStatusPageURL () {
    return this.statusPageURL
  }

  async setCognitoPoolID (cognitoPoolID) {
    this.cognitoPoolID = cognitoPoolID
  }

  async getCognitoPoolID () {
    return this.cognitoPoolID
  }
}

// export class Settings {
//   async allApiKeys () {
//     const keys = []
//     try {
//       const rawKeys = await new APIGateway().getApiKeys(stackName)
//       rawKeys.forEach(key => {
//         if (!key.enabled) return
//         keys.push(new ApiKey(key))
//       })
//       return keys
//     } catch (err) {
//       throw err
//     }
//   }

//   async lookupApiKey (id) {
//     try {
//       const key = await new APIGateway().getApiKey(id)
//       return new ApiKey(key)
//     } catch (err) {
//       switch (err.name) {
//         case 'NotFoundException':
//           throw new NotFoundError(err.message)
//         default:
//           throw err
//       }
//     }
//   }

//   async createApiKey (usagePlanID) {
//     const apiGateway = new APIGateway()
//     if (usagePlanID === undefined) {
//       usagePlanID = await new CloudFormation(stackName).getUsagePlanID()
//     }
//     const newKey = await apiGateway.createApiKey(stackName)
//     await apiGateway.createUsagePlanKey(newKey.id, usagePlanID)
//     return new ApiKey(newKey)
//   }
// }

// export class ApiKey {
//   constructor ({id, value, createdDate, lastUpdatedDate}) {
//     this.id = id
//     this.value = value
//     this.createdDate = createdDate
//     this.lastUpdatedDate = lastUpdatedDate
//   }

//   // no needs to validate this so far.

//   objectify () {
//     return {
//       id: this.id,
//       value: this.value,
//       createdDate: this.createdDate,
//       lastUpdatedDate: this.lastUpdatedDate
//     }
//   }

//   async delete () {
//     try {
//       await new APIGateway().disableApiKey(this.id)
//       await new APIGateway().deleteApiKey(this.id)
//     } catch (err) {
//       switch (err.name) {
//         case 'NotFoundException':
//           throw new NotFoundError(err.message)
//         default:
//           throw err
//       }
//     }
//   }
// }
