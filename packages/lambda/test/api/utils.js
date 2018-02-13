import assert from 'assert'
import sinon from 'sinon'
import { updateComponentStatus, SettingsProxy, MetricProxy } from 'api/utils'
import CloudFormation from 'aws/cloudFormation'
import { AdminUserPool } from 'aws/cognito'
import SES from 'aws/ses'
import SNS from 'aws/sns'
import S3 from 'aws/s3'
import MetricsStore from 'db/metrics'
import ComponentsStore from 'db/components'
import { Metric } from 'model/metrics'
import { metricStatusVisible, stackName } from 'utils/const'
import { NotFoundError, MutexLockedError } from 'utils/errors'

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

      assert(proxy.serviceName === serviceName)
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
      assert(serviceName === proxy.serviceName)
    })

    it('should get the service name from cache if available', async () => {
      const serviceName = 'test'
      const proxy = new SettingsProxy()
      proxy.serviceName = serviceName
      proxy.store.getServiceName = sinon.spy()

      const actual = await proxy.getServiceName()
      assert(serviceName === actual)
      assert(proxy.store.getServiceName.notCalled)
    })

    it('should return the empty service name if not found', async () => {
      const proxy = new SettingsProxy()
      proxy.store.getServiceName = async () => { throw new NotFoundError('') }

      const actual = await proxy.getServiceName()
      assert(actual === '')
    })
  })

  describe('setLogoID', () => {
    it('should update the LogoID', async () => {
      const proxy = new SettingsProxy()
      proxy.store.setLogoID = sinon.spy()

      const logoID = 'id'
      await proxy.setLogoID(logoID)

      assert(proxy.logoID === logoID)
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
      assert(logoID === proxy.logoID)
    })

    it('should get the LogoID from cache if available', async () => {
      const logoID = 'id'
      const proxy = new SettingsProxy()
      proxy.logoID = logoID
      proxy.store.getLogoID = sinon.spy()

      const actual = await proxy.getLogoID()
      assert(logoID === actual)
      assert(proxy.store.getLogoID.notCalled)
    })

    it('should return the empty value if not found', async () => {
      const proxy = new SettingsProxy()
      proxy.store.getLogoID = async () => { throw new NotFoundError('') }

      const actual = await proxy.getLogoID()
      assert(actual === '')
    })
  })

  describe('updateUserPool', () => {
    it('should update the user pool with valid params', async () => {
      const cognitoPoolID = 'id'
      const serviceName = 'test'
      const adminPageURL = 'admin'

      const proxy = new SettingsProxy()
      proxy.serviceName = serviceName
      proxy.cloudFormation.getAdminPageCloudFrontURL = async () => adminPageURL
      proxy.cloudFormation.getUserPoolID = async () => cognitoPoolID
      sinon.stub(AdminUserPool, 'get', (poolID, params) => {
        assert(poolID === cognitoPoolID)
        assert(params.serviceName === serviceName)
        assert(params.adminPageURL === adminPageURL)
        return new Promise((resolve) => { resolve(new AdminUserPool({})) })
      })
      const updatePoolStub = sinon.stub(AdminUserPool.prototype, 'update')
      await proxy.updateUserPool()

      assert(updatePoolStub.calledOnce)

      AdminUserPool.get.restore()
      AdminUserPool.prototype.update.restore()
    })
  })

  describe('testEmailAddress', () => {
    let sendEmailStub

    beforeEach(() => {
      sendEmailStub = sinon.stub(SES.prototype, 'sendEmailWithRetry').returns(new Promise(resolve => { resolve() }))
    })

    afterEach(() => {
      SES.prototype.sendEmailWithRetry.restore()
    })

    it('should send test email', async () => {
      const settings = {sourceRegion: 'us-west-1', sourceEmailAddress: 'test@example.com'}

      await new SettingsProxy().testEmailAddress(settings)
      assert(sendEmailStub.calledOnce)
    })

    it('should throw validation error if the email address is invalid', async () => {
      sendEmailStub.throws()

      const settings = {sourceRegion: 'us-west-1', sourceEmailAddress: 'test@example.com'}
      const proxy = new SettingsProxy()
      let err
      try {
        await proxy.testEmailAddress(settings)
      } catch (error) {
        err = error
      }

      assert(err.name === 'ValidationError')
    })
  })

  describe('existsNotificationHandler', () => {
    let listTopicsStub

    beforeEach(() => {
      listTopicsStub = sinon.stub(SNS.prototype, 'listTopics')
    })

    afterEach(() => {
      SNS.prototype.listTopics.restore()
    })

    it('should return true if the topic exists', async () => {
      const topic = `arn:aws:sns:us-west-2:account:${stackName}-BouncesAndComplaintsNotification`
      listTopicsStub.returns([topic])

      assert(await new SettingsProxy().existsNotificationHandler('us-west-1'))
    })

    it('should return false if the topic doesn\'t exist', async () => {
      const topic = `arn:aws:sns:us-west-2:account:${stackName}-NotExist`
      listTopicsStub.returns([topic])

      assert(!await new SettingsProxy().existsNotificationHandler('us-west-1'))
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
