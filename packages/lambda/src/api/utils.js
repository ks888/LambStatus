import CloudFormation from 'aws/cloudFormation'
import {AdminUserPool} from 'aws/cognito'
import S3 from 'aws/s3'
import SNS, {messageType} from 'aws/sns'
import ComponentsStore from 'db/components'
import MetricsStore from 'db/metrics'
import SettingsStore from 'db/settings'
import { Component } from 'model/components'
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
  constructor () {
    this.store = new SettingsStore()
    this.cloudFormation = new CloudFormation(stackName)
    this.sns = new SNS()
  }

  async setServiceName (serviceName) {
    this.serviceName = serviceName

    await this.store.setServiceName(serviceName)
    await this.updateUserPool()
    await this.sns.notifyIncident('', messageType.metadataChanged)
  }

  async getServiceName () {
    if (this.serviceName !== undefined) {
      return this.serviceName
    }

    let storedServiceName
    try {
      storedServiceName = await this.store.getServiceName()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedServiceName = ''
    }

    this.serviceName = storedServiceName
    return storedServiceName
  }

  async setLogoID (logoID) {
    this.logoID = logoID

    await this.store.setLogoID(logoID)
  }

  async getLogoID () {
    if (this.logoID !== undefined) {
      return this.logoID
    }

    let storedLogoID
    try {
      storedLogoID = await this.store.getLogoID()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedLogoID = ''
    }

    this.logoID = storedLogoID
    return storedLogoID
  }

  async deleteLogoID () {
    delete this.logoID

    await this.store.deleteLogoID()
  }

  async setBackgroundColor (color) {
    this.backgroundColor = color

    await this.store.setBackgroundColor(color)
  }

  async getBackgroundColor () {
    if (this.backgroundColor !== undefined) {
      return this.backgroundColor
    }

    let storedColor
    try {
      storedColor = await this.store.getBackgroundColor()
    } catch (err) {
      if (err.name !== NotFoundError.name) throw err
      storedColor = ''
    }

    this.backgroundColor = storedColor
    return storedColor
  }

  async updateUserPool () {
    const poolID = await this.cloudFormation.getUserPoolID()
    if (poolID === '') {
      console.warn('UserPoolID not found')
      return
    }

    const params = {
      serviceName: await this.getServiceName(),
      adminPageURL: await this.cloudFormation.getAdminPageCloudFrontURL()
    }
    const cognito = await AdminUserPool.get(poolID, params)
    await cognito.update()
  }

  async setEmailNotification (emailNotification) {
    this.emailNotification = emailNotification

    await this.store.setEmailNotification(emailNotification)
  }

  async getEmailNotification () {
    if (this.emailNotification !== undefined) {
      return this.emailNotification
    }

    this.emailNotification = await this.store.getEmailNotification()
    return this.emailNotification
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
