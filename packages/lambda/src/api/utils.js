import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import S3 from 'aws/s3'
import SNS from 'aws/sns'
import ComponentsStore from 'db/components'
import MetricsStore from 'db/metrics'
import SettingsStore from 'db/settings'
import { Component } from 'model/components'
import { Settings } from 'model/settings'
import { Metric } from 'model/metrics'
import { region, stackName } from 'utils/const'
import { NotFoundError } from 'utils/errors'

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
    this.cloudFormation = new CloudFormation(stackName)
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

    let storedServiceName
    try {
      storedServiceName = await this.store.getServiceName()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedServiceName = ''
    }

    await this.settings.setServiceName(storedServiceName)
    return storedServiceName
  }

  async getAdminPageURL () {
    const adminPageURL = await this.settings.getAdminPageURL()
    if (adminPageURL !== undefined) {
      return adminPageURL
    }

    const storedAdminPageURL = await this.cloudFormation.getAdminPageCloudFrontURL()
    await this.settings.setAdminPageURL(storedAdminPageURL)
    return storedAdminPageURL
  }

  async getStatusPageURL () {
    const statusPageURL = await this.settings.getStatusPageURL()
    if (statusPageURL !== undefined) {
      return statusPageURL
    }

    const storedStatusPageURL = await this.cloudFormation.getStatusPageCloudFrontURL()
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

    let storedCognitoPoolID
    try {
      storedCognitoPoolID = await this.store.getCognitoPoolID()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedCognitoPoolID = ''
    }

    await this.settings.setCognitoPoolID(storedCognitoPoolID)
    return storedCognitoPoolID
  }

  async setLogoID (logoID) {
    await this.settings.setLogoID(logoID)

    await this.store.setLogoID(await this.settings.getLogoID())
  }

  async getLogoID () {
    const logoID = await this.settings.getLogoID()
    if (logoID !== undefined) {
      return logoID
    }

    let storedLogoID
    try {
      storedLogoID = await this.store.getLogoID()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedLogoID = ''
    }

    await this.settings.setLogoID(storedLogoID)
    return storedLogoID
  }

  async deleteLogoID () {
    await this.settings.deleteLogoID()

    await this.store.deleteLogoID()
  }

  async setBackgroundColor (color) {
    await this.settings.setBackgroundColor(color)

    await this.store.setBackgroundColor(await this.settings.getBackgroundColor())
  }

  async getBackgroundColor () {
    const color = await this.settings.getBackgroundColor()
    if (color !== undefined) {
      return color
    }

    let storedColor
    try {
      storedColor = await this.store.getBackgroundColor()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedColor = ''
    }

    await this.settings.setBackgroundColor(storedColor)
    return storedColor
  }

  async updateUserPool () {
    const poolID = await this.getCognitoPoolID()
    if (poolID === '') {
      console.warn('CognitoPoolID not found')
      return
    }

    const cognito = new Cognito()
    const userPool = await cognito.getUserPool(poolID)

    userPool.serviceName = await this.getServiceName()
    userPool.adminPageURL = await this.getAdminPageURL()
    await cognito.updateUserPool(userPool)
  }
}

// MetricProxy is a wrapper of Metric class. It's nicely load and save datapoints to/from S3.
// TODO: add a factory method to create MetricProxy class transparently.
export class MetricProxy extends Metric {
  constructor (params) {
    super(params)
    this.s3 = new S3()
    this.store = new MetricsStore()
    this.cloudFormation = new CloudFormation(stackName)
  }

  async getBucketName () {
    if (this.bucketName !== undefined) {
      return this.bucketName
    }
    this.bucketName = await new CloudFormation(stackName).getStatusPageBucketName()
    return this.bucketName
  }

  buildObjectName (metricID, date) {
    return `metrics/${metricID}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.json`
  }

  async getDatapoints (date) {
    const datapoints = await super.getDatapoints(date)
    if (datapoints !== undefined) {
      return datapoints
    }

    const objectName = this.buildObjectName(this.metricID, date)
    const bucketName = await this.getBucketName()
    let storedDatapoints
    try {
      const obj = await this.s3.getObject(region, bucketName, objectName)
      storedDatapoints = JSON.parse(obj.Body.toString())
    } catch (error) {
      // There will be no existing object at first.
      storedDatapoints = undefined
    }

    await super.setDatapoints(date, storedDatapoints)
    return storedDatapoints
  }

  async setDatapoints (date, datapoints) {
    await super.setDatapoints(date, datapoints)

    const objectName = this.buildObjectName(this.metricID, date)
    const bucketName = await this.getBucketName()
    await this.s3.putObject(region, bucketName, objectName, JSON.stringify(datapoints))
  }

  async insertDatapoints (datapoints) {
    const store = new MetricsStore()
    await store.lock(this.metricID)

    let insertedDatapoints
    try {
      insertedDatapoints = await super.insertDatapoints(datapoints)
    } finally {
      try {
        await store.unlock(this.metricID)
      } catch (err) {
        console.error(`failed to unlock mutex (metricID: ${this.metricID})`, err.toString())
      }
    }

    return insertedDatapoints
  }
}

// MetricsStoreProxy is a wrapper of MetricsStore class. It's just wrap Metric class by MetricProxy class.
export class MetricsStoreProxy extends MetricsStore {
  async query () {
    const metrics = await super.query()
    return metrics.map(metric => new MetricProxy(metric))
  }

  async get (metricID) {
    const metric = await super.get(metricID)
    return new MetricProxy(metric)
  }

  async create (metric) {
    const createdMetric = await super.create(metric)
    return new MetricProxy(createdMetric)
  }

  async update (metric) {
    const updatedMetric = await super.updatee(metric)
    return new MetricProxy(updatedMetric)
  }
}
