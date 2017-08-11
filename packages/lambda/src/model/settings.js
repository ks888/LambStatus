import SettingsStore from 'db/settings'
import CloudFormation from 'aws/cloudFormation'
import APIGateway from 'aws/apiGateway'
import Cognito from 'aws/cognito'
import SNS from 'aws/sns'
import { ValidationError, NotFoundError } from 'utils/errors'
import { stackName } from 'utils/const'

const settingsKeyServiceName = 'ServiceName'
const settingsKeyStatusPageURL = 'StatusPageURL'
const settingsKeyAdminPageURL = 'AdminPageURL'
const settingsKeyCognitoPoolID = 'CognitoPoolID'

// InvocationURL, UserPoolID, and ClientID are parts of S3 object (settings.json). Do not store them here.

export class Settings {
  constructor () {
    this.store = new SettingsStore()
  }

  validateURL (url) {
    // eslint-disable-next-line no-useless-escape, max-len
    return url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) !== null
  }

  async getServiceName () {
    try {
      return await this.store.get(settingsKeyServiceName)
    } catch (err) {
      if (err.name === NotFoundError.name) {
        return ''
      }
      throw err
    }
  }

  async setServiceName (value) {
    await this.store.update(settingsKeyServiceName, value)
    await this.updateUserPool()

    await new SNS().notifyIncident()
  }

  async getStatusPageURL () {
    try {
      return await this.store.get(settingsKeyStatusPageURL)
    } catch (err) {
      if (err.name === NotFoundError.name) {
        return ''
      }
      throw err
    }
  }

  async setStatusPageURL (value) {
    if (!this.validateURL(value)) {
      throw new ValidationError('invalid url')
    }
    await this.store.update(settingsKeyStatusPageURL, value)

    await new SNS().notifyIncident()
  }

  async getAdminPageURL () {
    try {
      return await this.store.get(settingsKeyAdminPageURL)
    } catch (err) {
      if (err.name === NotFoundError.name) {
        return ''
      }
      throw err
    }
  }

  async setAdminPageURL (value) {
    if (!this.validateURL(value)) {
      throw new ValidationError('invalid url')
    }
    await this.store.update(settingsKeyAdminPageURL, value)
    await this.updateUserPool()
  }

  async getCognitoPoolID () {
    try {
      return await this.store.get(settingsKeyCognitoPoolID)
    } catch (err) {
      if (err.name === NotFoundError.name) {
        return ''
      }
      throw err
    }
  }

  async setCognitoPoolID (value) {
    await this.store.update(settingsKeyCognitoPoolID, value)
  }

  async updateUserPool () {
    const cognitoPoolID = await this.getCognitoPoolID()
    if (cognitoPoolID) {
      const serviceName = await this.getServiceName()
      const adminPageURL = await this.getAdminPageURL()
      const userPool = await new Cognito().describeUserPool(cognitoPoolID)
      const snsCallerArn = userPool.SmsConfiguration.SnsCallerArn
      await new Cognito().updateUserPool(cognitoPoolID, serviceName, adminPageURL, snsCallerArn)
    } else {
      console.warn('CognitoPoolID not found')
    }
  }

  async allApiKeys () {
    const keys = []
    try {
      const rawKeys = await new APIGateway().getApiKeys(stackName)
      rawKeys.forEach(key => {
        if (!key.enabled) return
        keys.push(new ApiKey(key.id, key.value, key.createdDate, key.lastUpdatedDate))
      })
      return keys
    } catch (err) {
      throw err
    }
  }

  async lookupApiKey (id) {
    try {
      const key = await new APIGateway().getApiKey(id)
      return new ApiKey(key.id, key.value, key.createdDate, key.lastUpdatedDate)
    } catch (err) {
      switch (err.name) {
        case 'NotFoundException':
          throw new NotFoundError(err.message)
        default:
          throw err
      }
    }
  }

  async createApiKey () {
    const apiGateway = new APIGateway()
    const usagePlanID = await new CloudFormation(stackName).getUsagePlanID()
    const newKey = await apiGateway.createApiKey(stackName)
    await apiGateway.createUsagePlanKey(newKey.id, usagePlanID)
    return new ApiKey(newKey.id, newKey.value, newKey.createdDate, newKey.lastUpdatedDate)
  }
}

export class ApiKey {
  constructor (id, value, createdDate, lastUpdatedDate) {
    this.id = id
    this.value = value
    this.createdDate = createdDate
    this.lastUpdatedDate = lastUpdatedDate
  }

  // no needs to validate this so far.

  objectify () {
    return {
      id: this.id,
      value: this.value,
      createdDate: this.createdDate,
      lastUpdatedDate: this.lastUpdatedDate
    }
  }

  async delete () {
    try {
      await new APIGateway().disableApiKey(this.id)
      await new APIGateway().deleteApiKey(this.id)
    } catch (err) {
      switch (err.name) {
        case 'NotFoundException':
          throw new NotFoundError(err.message)
        default:
          throw err
      }
    }
  }
}
