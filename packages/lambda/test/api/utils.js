import assert from 'assert'
import sinon from 'sinon'
import { updateComponentStatus, SettingsProxy, MetricProxy } from 'api/utils'
import CloudFormation from 'aws/cloudFormation'
import Cognito, { UserPool } from 'aws/cognito'
import S3 from 'aws/s3'
import MetricsStore from 'db/metrics'
import ComponentsStore from 'db/components'
import { Metric } from 'model/metrics'
import { metricStatusVisible } from 'utils/const'
import { MutexLockedError } from 'utils/errors'

describe('updateComponentStatus', () => {
  it('should call updateStatus', () => {
    const updateStatusStub = sinon.stub(ComponentsStore.prototype, 'updateStatus').returns()

    updateComponentStatus({componentID: '1', status: 'test'})
    assert(updateStatusStub.calledOnce)

    ComponentsStore.prototype.updateStatus.restore()
  })
})

describe('SettingsProxy', () => {
  describe('setServiceName', () => {
    it('should update the service name and user pool and publish notification', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setServiceName = sinon.spy()
      proxy.updateUserPool = sinon.spy()
      proxy.sns.notifyIncident = sinon.spy()

      const serviceName = 'test'
      await proxy.setServiceName(serviceName)

      assert(proxy.settings.serviceName === serviceName)
      assert(proxy.store.setServiceName.calledOnce)
      assert(proxy.store.setServiceName.firstCall.args[0] === serviceName)
      assert(proxy.updateUserPool.calledOnce)
      assert(proxy.sns.notifyIncident.calledOnce)
    })
  })

  describe('getServiceName', () => {
    it('should get the service name from store if not cached', async () => {
      const serviceName = 'test'
      const proxy = new SettingsProxy()
      proxy.store.getServiceName = async () => serviceName

      const actual = await proxy.getServiceName()
      assert(serviceName === actual)
      assert(serviceName === proxy.settings.serviceName)
    })

    it('should get the service name from cache if available', async () => {
      const serviceName = 'test'
      const proxy = new SettingsProxy()
      proxy.settings.setServiceName(serviceName)
      proxy.store.getServiceName = sinon.spy()

      const actual = await proxy.getServiceName()
      assert(serviceName === actual)
      assert(proxy.store.getServiceName.notCalled)
    })
  })

  describe('getAdminPageURL', () => {
    it('should get the AdminPage URL from CloudFormation if not cached', async () => {
      const adminPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.cloudFormation.getAdminPageCloudFrontURL = async () => adminPageURL

      const actual = await proxy.getAdminPageURL()
      assert(adminPageURL === actual)
      assert(adminPageURL === proxy.settings.adminPageURL)
    })

    it('should get the AdminPage URL from cache if available', async () => {
      const adminPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.settings.setAdminPageURL(adminPageURL)
      proxy.store.getAdminPageURL = sinon.spy()

      const actual = await proxy.getAdminPageURL()
      assert(adminPageURL === actual)
      assert(proxy.store.getAdminPageURL.notCalled)
    })
  })

  describe('getStatusPageURL', () => {
    it('should get the StatusPage URL from CloudFormation if not cached', async () => {
      const statusPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.cloudFormation.getStatusPageCloudFrontURL = async () => statusPageURL

      const actual = await proxy.getStatusPageURL()
      assert(statusPageURL === actual)
      assert(statusPageURL === proxy.settings.statusPageURL)
    })

    it('should get the StatusPage URL from cache if available', async () => {
      const statusPageURL = 'https://example.com'
      const proxy = new SettingsProxy()
      proxy.settings.setStatusPageURL(statusPageURL)
      proxy.store.getStatusPageURL = sinon.spy()

      const actual = await proxy.getStatusPageURL()
      assert(statusPageURL === actual)
      assert(proxy.store.getStatusPageURL.notCalled)
    })
  })

  describe('setCognitoPoolID', () => {
    it('should update the CognitoPoolID', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setCognitoPoolID = sinon.spy()
      proxy.updateUserPool = sinon.spy()
      proxy.sns.notifyIncident = sinon.spy()

      const cognitoPoolID = 'id'
      await proxy.setCognitoPoolID(cognitoPoolID)

      assert(proxy.settings.cognitoPoolID === cognitoPoolID)
      assert(proxy.store.setCognitoPoolID.calledOnce)
      assert(proxy.store.setCognitoPoolID.firstCall.args[0] === cognitoPoolID)
      assert(proxy.updateUserPool.notCalled)
      assert(proxy.sns.notifyIncident.notCalled)
    })
  })

  describe('getCognitoPoolID', () => {
    it('should get the CognitoPoolID from store if not cached', async () => {
      const cognitoPoolID = 'id'
      const proxy = new SettingsProxy()
      proxy.store.getCognitoPoolID = async () => cognitoPoolID

      const actual = await proxy.getCognitoPoolID()
      assert(cognitoPoolID === actual)
      assert(cognitoPoolID === proxy.settings.cognitoPoolID)
    })

    it('should get the CognitoPoolID from cache if available', async () => {
      const cognitoPoolID = 'id'
      const proxy = new SettingsProxy()
      proxy.settings.setCognitoPoolID(cognitoPoolID)
      proxy.store.getCognitoPoolID = sinon.spy()

      const actual = await proxy.getCognitoPoolID()
      assert(cognitoPoolID === actual)
      assert(proxy.store.getCognitoPoolID.notCalled)
    })
  })

  describe('setLogoID', () => {
    it('should update the LogoID', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setLogoID = sinon.spy()

      const logoID = 'id'
      await proxy.setLogoID(logoID)

      assert(proxy.settings.logoID === logoID)
      assert(proxy.store.setLogoID.calledOnce)
      assert(proxy.store.setLogoID.firstCall.args[0] === logoID)
    })
  })

  describe('getLogoID', () => {
    it('should get the LogoID from store if not cached', async () => {
      const logoID = 'id'
      const proxy = new SettingsProxy()
      proxy.store.getLogoID = async () => logoID

      const actual = await proxy.getLogoID()
      assert(logoID === actual)
      assert(logoID === proxy.settings.logoID)
    })

    it('should get the LogoID from cache if available', async () => {
      const logoID = 'id'
      const proxy = new SettingsProxy()
      proxy.settings.setLogoID(logoID)
      proxy.store.getLogoID = sinon.spy()

      const actual = await proxy.getLogoID()
      assert(logoID === actual)
      assert(proxy.store.getLogoID.notCalled)
    })
  })

  describe('updateUserPool', () => {
    it('should update the user pool with valid params', async () => {
      const cognitoPoolID = 'id'
      sinon.stub(Cognito.prototype, 'getUserPool').returns(new UserPool({userPoolID: cognitoPoolID, snsCallerArn: ''}))
      const updatePoolStub = sinon.stub(Cognito.prototype, 'updateUserPool').returns()

      const serviceName = 'test'
      const adminPageURL = 'admin'
      const proxy = new SettingsProxy({serviceName, adminPageURL, cognitoPoolID})
      await proxy.updateUserPool()

      assert(updatePoolStub.calledOnce)
      assert(updatePoolStub.firstCall.args[0].userPoolID === cognitoPoolID)
      assert(updatePoolStub.firstCall.args[0].serviceName === serviceName)
      assert(updatePoolStub.firstCall.args[0].adminPageURL === adminPageURL)
      assert(updatePoolStub.firstCall.args[0].snsCallerArn === '')

      Cognito.prototype.getUserPool.restore()
    })
  })
})

describe('MetricProxy', () => {
  const generateConstructorParams = (metricID) => {
    return {
      metricID,
      type: 'Mock',
      title: 'title',
      status: metricStatusVisible,
      unit: 'unit',
      description: 'description',
      decimalPlaces: 0,
      order: 0,
      props: {key: 'value'}
    }
  }

  describe('getBucketName', () => {
    afterEach(() => {
      CloudFormation.prototype.getStatusPageBucketName.restore()
    })

    it('should return the bucket name and save it', async () => {
      const expected = 'bucket'
      sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns(expected)

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      const actual = await metric.getBucketName()
      assert(expected === actual)
      assert(expected === metric.bucketName)
    })

    it('should reuse the previously fetched bucket name', async () => {
      const expected = 'bucket'
      const stub = sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns(expected)

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      await metric.getBucketName()
      await metric.getBucketName()
      assert(stub.calledOnce)
    })
  })

  describe('getDatapoints', () => {
    afterEach(() => {
      S3.prototype.getObject.restore()
      CloudFormation.prototype.getStatusPageBucketName.restore()
    })

    it('should return datapoints at the specified date', async () => {
      const date = new Date(2017, 6, 3, 0, 0, 0)
      const timestamp = date.toISOString()
      const value = 1
      const expected = {Body: new Buffer(`[{"timestamp":"${timestamp}","value":${value}}]`)}
      const stub = sinon.stub(S3.prototype, 'getObject').returns(expected)
      sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns('bucket')

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      const actual = await metric.getDatapoints(date)
      assert(actual.length === 1)
      assert(actual[0].timestamp === timestamp)
      assert(actual[0].value === value)

      assert(stub.calledOnce)
      assert(stub.args[0][2] === `metrics/${metric.metricID}/2017/7/3.json`)
    })

    it('should return undefined if no datapoint', async () => {
      const date = new Date(2017, 6, 3, 0, 0, 0)
      sinon.stub(S3.prototype, 'getObject').throws()
      sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns('')

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      const actual = await metric.getDatapoints(date)
      assert(actual === undefined)
    })
  })

  describe('setDatapoints', () => {
    afterEach(() => {
      S3.prototype.putObject.restore()
      CloudFormation.prototype.getStatusPageBucketName.restore()
    })

    it('should put S3 object', async () => {
      const stub = sinon.stub(S3.prototype, 'putObject').returns()
      sinon.stub(CloudFormation.prototype, 'getStatusPageBucketName').returns()
      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      const datapoints = [{timestamp: '2017-07-03T01:00:00.000Z', value: 1}]
      await metric.setDatapoints(new Date(2017, 6, 3, 0, 0, 0), datapoints)
      const argsOnFirstCall = stub.args[0]
      assert(argsOnFirstCall[2] === `metrics/${metric.metricID}/2017/7/3.json`)
      const body = JSON.parse(argsOnFirstCall[3])
      assert(body.length === 1)
    })
  })

  describe('insertDatapoints', () => {
    afterEach(() => {
      MetricsStore.prototype.lock.restore()
      MetricsStore.prototype.unlock.restore()
      Metric.prototype.insertDatapoints.restore()
    })

    it('throws mutex error if failed to lock the resource', async () => {
      const insertDatapointsStub = sinon.stub(Metric.prototype, 'insertDatapoints')
      sinon.stub(MetricsStore.prototype, 'lock').throws(new MutexLockedError())
      sinon.stub(MetricsStore.prototype, 'unlock').returns()

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)
      let actual
      try {
        await metric.insertDatapoints()
      } catch (err) {
        actual = err
      }
      assert(actual.name === 'MutexLockedError')
      assert(insertDatapointsStub.notCalled)
    })

    it('calls unlock on successful', async () => {
      const insertDatapointsStub = sinon.stub(Metric.prototype, 'insertDatapoints')
      sinon.stub(MetricsStore.prototype, 'lock').returns()
      const unlockStub = sinon.stub(MetricsStore.prototype, 'unlock').returns()

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      await metric.insertDatapoints()
      assert(insertDatapointsStub.calledOnce)
      assert(unlockStub.calledOnce)
    })

    it('calls unlock on failed', async () => {
      sinon.stub(Metric.prototype, 'insertDatapoints').throws()
      sinon.stub(MetricsStore.prototype, 'lock').returns()
      const unlockStub = sinon.stub(MetricsStore.prototype, 'unlock').returns()

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)
      let actual
      try {
        await metric.insertDatapoints()
      } catch (err) {
        actual = err
      }
      assert(unlockStub.calledOnce)
      assert(actual !== undefined)
    })

    it('throws original error on unlock failed', async () => {
      let expect = new Error()
      sinon.stub(Metric.prototype, 'insertDatapoints').throws(expect)
      sinon.stub(MetricsStore.prototype, 'lock').returns()
      const unlockStub = sinon.stub(MetricsStore.prototype, 'unlock').throws()

      const params = generateConstructorParams()
      const metric = new MetricProxy(params)

      let actual
      try {
        await metric.insertDatapoints()
      } catch (err) {
        actual = err
      }
      assert(unlockStub.calledOnce)
      assert(actual === expect)
    })
  })
})
