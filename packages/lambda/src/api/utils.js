import Cognito from 'aws/cognito'
import SNS from 'aws/sns'
import { Component } from 'model/components'
import { Settings } from 'model/settings'
import ComponentsStore from 'db/components'
import SettingsStore from 'db/settings'

export const updateComponentStatus = async (componentObj) => {
  const component = new Component(componentObj)
  // TODO: validate
  const componentsStore = new ComponentsStore()
  // TODO: use update method for simpler store API
  await componentsStore.updateStatus(component.componentID, component.status)
  return component
}

export class SettingsProxy {
  constructor (params) {
    this.settings = new Settings(params)
    this.store = new SettingsStore()
    this.sns = new SNS()
  }

  async setServiceName (serviceName) {
    await this.settings.setServiceName(serviceName)

    await this.store.setServiceName(await this.settings.getServiceName())
    await this.updateUserPool()
    await this.sns.notifyIncident()
  }

  async getServiceName () {
    const serviceName = await this.settings.getServiceName()
    if (serviceName !== undefined) {
      return serviceName
    }

    const storedServiceName = await this.store.getServiceName()
    await this.settings.setServiceName(storedServiceName)
    return storedServiceName
  }

  async setAdminPageURL (adminPageURL) {
    await this.settings.setAdminPageURL(adminPageURL)

    await this.store.setAdminPageURL(await this.settings.getAdminPageURL())
    await this.updateUserPool()
  }

  async getAdminPageURL () {
    const adminPageURL = await this.settings.getAdminPageURL()
    if (adminPageURL !== undefined) {
      return adminPageURL
    }

    const storedAdminPageURL = await this.store.getAdminPageURL()
    await this.settings.setAdminPageURL(storedAdminPageURL)
    return storedAdminPageURL
  }

  async setStatusPageURL (statusPageURL) {
    await this.settings.setStatusPageURL(statusPageURL)

    await this.store.setStatusPageURL(await this.settings.getStatusPageURL())
    await this.sns.notifyIncident()
  }

  async getStatusPageURL () {
    const statusPageURL = await this.settings.getStatusPageURL()
    if (statusPageURL !== undefined) {
      return statusPageURL
    }

    const storedStatusPageURL = await this.store.getStatusPageURL()
    await this.settings.setStatusPageURL(storedStatusPageURL)
    return storedStatusPageURL
  }

  async setCognitoPoolID (cognitoPoolID) {
    await this.settings.setCognitoPoolID(cognitoPoolID)

    await this.store.setCognitoPoolID(await this.settings.getCognitoPoolID())
  }

  async getCognitoPoolID () {
    const cognitoPoolID = await this.settings.getCognitoPoolID()
    if (cognitoPoolID !== undefined) {
      return cognitoPoolID
    }

    const storedCognitoPoolID = await this.store.getCognitoPoolID()
    await this.settings.setCognitoPoolID(storedCognitoPoolID)
    return storedCognitoPoolID
  }

  async updateUserPool () {
    const poolID = await this.getCognitoPoolID()
    if (poolID === '') {
      console.warn('CognitoPoolID not found')
      return
    }
    const serviceName = await this.getServiceName()
    const adminPageURL = await this.getAdminPageURL()

    const cognito = new Cognito()
    const userPool = await cognito.getUserPool(poolID)
    const snsCallerArn = userPool.snsCallerArn

    await cognito.updateUserPool(poolID, serviceName, adminPageURL, snsCallerArn)
  }
}
