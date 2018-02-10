import assert from 'assert'
import sinon from 'sinon'
import { SettingsProxy } from 'api/utils'
import { handle, IncidentEmailContent, MaintenanceEmailContent } from 'api/sendEmails'
import Cognito from 'aws/cognito'
import SES from 'aws/ses'
import { messageType } from 'aws/sns'
import CloudFormation from 'aws/cloudFormation'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

describe('sendEmails', () => {
  let sendEmailStub
  let queryIncidentUpdatesStub
  let listUsersStub

  beforeEach(() => {
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    sinon.stub(SettingsProxy.prototype, 'getStatusPageURL')
    sinon.stub(SettingsProxy.prototype, 'getServiceName')
    sendEmailStub = sinon.stub(SES.prototype, 'sendEmailWithRetry').returns(new Promise(resolve => { resolve() }))
    sinon.stub(IncidentsStore.prototype, 'get').returns({})
    queryIncidentUpdatesStub = sinon.stub(IncidentUpdatesStore.prototype, 'query')
      .returns([{message: 'test', incidentStatus: 'Resolved', createdAt: '1'}])
    listUsersStub = sinon.stub(Cognito.prototype, 'listUsers').returns([{Attributes: [{}]}])
    sinon.spy(console, 'log')
  })

  afterEach(() => {
    CloudFormation.prototype.getSubscribersPoolID.restore()
    SettingsProxy.prototype.getStatusPageURL.restore()
    SettingsProxy.prototype.getServiceName.restore()
    SES.prototype.sendEmailWithRetry.restore()
    IncidentsStore.prototype.get.restore()
    IncidentUpdatesStore.prototype.query.restore()
    Cognito.prototype.listUsers.restore()
    console.log.restore()
  })

  it('should sort the updates by createdAt', async () => {
    const expectOrder = [
      {message: 'Update 3', createdAt: '3'},
      {message: 'Update 2', createdAt: '2'},
      {message: 'Update 1', createdAt: '1'}
    ]
    const randomOrder = [expectOrder[1], expectOrder[2], expectOrder[0]]
    queryIncidentUpdatesStub.returns(randomOrder)

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    await handle({Records: [{Sns: {Message: event}}]}, null, (err, data) => {
      assert(err === null)
    })

    const actualBody = sendEmailStub.firstCall.args[2]
    const messageLocations = expectOrder.map(upd => actualBody.indexOf(upd.message))
    for (let i = 0; i < expectOrder.length - 1; i++) {
      assert(messageLocations[i] < messageLocations[i + 1])
    }
  })

  it('should send one email per one user', async () => {
    const users = []
    for (let i = 0; i < 100; i++) {
      users.push({Username: `${i}`, Attributes: [{}]})
    }
    listUsersStub.returns(users)

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    const rawEvent = {Records: [{Sns: {Message: event}}]}
    await handle(rawEvent, null, (err, data) => {
      assert(err === null)
    })

    assert(sendEmailStub.callCount === users.length)
  })

  it('should print the error on failed to send email', async () => {
    sendEmailStub.throws(new Error('test'))

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    const rawEvent = {Records: [{Sns: {Message: event}}]}
    await handle(rawEvent, null, (err, data) => {
      assert(err === null)
    })
    assert(console.log.calledOnce)
  })

  it('should not send email if uninterested message types', async () => {
    const uninterestedTypes = [
      messageType.unknown,
      messageType.incidentPatched,
      messageType.incidentDeleted,
      messageType.maintenancePatched,
      messageType.maintenanceDeleted,
      messageType.metadataChanged
    ]

    for (let type of uninterestedTypes) {
      const event = `{"message": "1", "type": ${type}}`
      const rawEvent = {Records: [{Sns: {Message: event}}]}
      await handle(rawEvent, null, (err) => { assert(err === null) })
      assert(sendEmailStub.notCalled)
    }
  })

  describe('IncidentEmailContent', () => {
    describe('getTitle', () => {
      it('should include the service name, the latest status and incident name', async () => {
        const serviceName = 'Service'
        const incidentName = 'Test'
        const status = 'Resolved'
        const incident = {name: incidentName}
        const incidentUpdates = [{message: 'test', incidentStatus: status, createdAt: '1'}]

        const email = new IncidentEmailContent({serviceName, incident, incidentUpdates})
        const actual = email.getTitle()
        assert(actual.includes(incidentName))
        assert(actual.includes(status))
        assert(actual.includes(serviceName))
      })
    })

    describe('getBody', () => {
      it('should include the unsubscribe link', async () => {
        const statusPageURL = 'statuspage'
        const username = 'testuser'
        const token = 'secret'
        const user = {username, token}

        const email = new IncidentEmailContent({statusPageURL, incident: {}, incidentUpdates: [{}]})
        const actual = email.getBody(user)
        assert(actual.includes(token))
        assert(actual.includes(username))
        assert(actual.includes(statusPageURL))
      })

      it('should include the word \'Incident\'', async () => {
        const email = new IncidentEmailContent({incident: {}, incidentUpdates: [{}]})
        const actual = email.getBody({})
        assert(actual.includes('Incident'))
        assert(!actual.includes('Maintenance'))
      })

      it('should not include \'Previous Updates\' if only 1 update', async () => {
        const email = new IncidentEmailContent({incident: {}, incidentUpdates: [{}]})
        const actual = email.getBody({})
        assert(!actual.includes('Previous Updates'))
        assert(!actual.includes('New Incident Status'))
      })

      it('should return error if no updates', async () => {
        let err
        try {
          const email = new IncidentEmailContent({incident: {}, incidentUpdates: []})
          email.getBody({})
        } catch (error) {
          err = error
        }

        console.log(err)
        assert(err.message === 'no updates')
      })
    })
  })

  describe('MaintenanceEmailContent', () => {
    describe('getBody', () => {
      it('should include the word \'Maintenance\'', async () => {
        const email = new MaintenanceEmailContent({maintenance: {}, maintenanceUpdates: [{}]})
        const actual = email.getBody({})
        assert(actual.includes('Maintenance'))
        assert(!actual.includes('Incident'))
      })

      it('should include the start and end time', async () => {
        const startAt = '2017-12-29T16:00:00.000Z'
        const endAt = '2017-12-29T17:00:00.000Z'
        const email = new MaintenanceEmailContent({maintenance: {startAt, endAt}, maintenanceUpdates: [{}]})
        const actual = email.getBody({})
        assert(actual.includes('16:00'))
        assert(actual.includes('17:00'))
      })
    })
  })
})
