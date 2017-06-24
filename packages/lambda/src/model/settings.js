import SettingsStore from 'db/settings'
import APIGateway from 'aws/apiGateway'
import Cognito from 'aws/cognito'
import SNS from 'aws/sns'
import { ValidationError, NotFoundError } from 'utils/errors'

const settingsKeyServiceName = 'ServiceName'
const settingsKeyStatusPageURL = 'StatusPageURL'
const settingsKeyAdminPageURL = 'AdminPageURL'
const settingsKeyCognitoPoolID = 'CognitoPoolID'

// InvocationURL, UserPoolID, ClientID are bootstrap set. Do not store here.

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

  async getApiKeys () {
    try {
      return await new APIGateway().getApiKeys()
    } catch (err) {
      throw err
    }
  }
}
