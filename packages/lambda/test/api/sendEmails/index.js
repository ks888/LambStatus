import assert from 'assert'
import sinon from 'sinon'
import { SettingsProxy } from 'api/utils'
import { handle } from 'api/sendEmails'
import Cognito from 'aws/cognito'
import SES from 'aws/ses'
import { messageType } from 'aws/sns'
import CloudFormation from 'aws/cloudFormation'
import IncidentsStore from 'db/incidents'
import IncidentUpdatesStore from 'db/incidentUpdates'

describe('sendEmails', () => {
  let getServiceNameStub
  let sendEmailStub
  let getIncidentStub
  let queryIncidentUpdatesStub
  let listUsersStub

  beforeEach(() => {
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
    sinon.stub(SettingsProxy.prototype, 'getStatusPageURL')
    getServiceNameStub = sinon.stub(SettingsProxy.prototype, 'getServiceName')
    sendEmailStub = sinon.stub(SES.prototype, 'sendEmail')
    getIncidentStub = sinon.stub(IncidentsStore.prototype, 'get').returns({})
    queryIncidentUpdatesStub = sinon.stub(IncidentUpdatesStore.prototype, 'query')
      .returns([{message: 'test', incidentStatus: 'Resolved', createdAt: '1'}])
    listUsersStub = sinon.stub(Cognito.prototype, 'listUsers').returns([{Attributes: [{}]}])
  })

  afterEach(() => {
    CloudFormation.prototype.getSubscribersPoolID.restore()
    SettingsProxy.prototype.getStatusPageURL.restore()
    SettingsProxy.prototype.getServiceName.restore()
    SES.prototype.sendEmail.restore()
    IncidentsStore.prototype.get.restore()
    IncidentUpdatesStore.prototype.query.restore()
    Cognito.prototype.listUsers.restore()
  })

  it('should have the title include the service name, the latest status and incident name', async () => {
    const incidentName = 'Test'
    const status = 'Resolved'
    const serviceName = 'Service'
    getIncidentStub.returns({name: incidentName})
    queryIncidentUpdatesStub.returns([{message: 'test', incidentStatus: status, createdAt: '1'}])
    getServiceNameStub.returns(serviceName)

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    const rawEvent = {Records: [{Sns: {Message: event}}]}
    await handle(rawEvent, null, (err, data) => {
      assert(err === null)
    })

    const actual = sendEmailStub.firstCall.args[1]
    assert(actual.includes(incidentName))
    assert(actual.includes(status))
    assert(actual.includes(serviceName))
  })

  it('should have the body include the unsubscribe link', async () => {
    const username = 'testuser'
    const token = 'secret'
    const users = [{Username: username, Attributes: [{Name: 'custom:token', Value: token}]}]
    listUsersStub.returns(users)

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    const rawEvent = {Records: [{Sns: {Message: event}}]}
    await handle(rawEvent, null, (err, data) => {
      assert(err === null)
    })

    const actual = sendEmailStub.firstCall.args[2]
    assert(actual.includes(token))
    assert(actual.includes(username))
  })

  it('should choose the latest update', async () => {
    const status = 'Resolved'
    queryIncidentUpdatesStub.returns([
      {incidentStatus: 'Unknown', createdAt: '1'},
      {incidentStatus: status, createdAt: '2'}
    ])

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    await handle({Records: [{Sns: {Message: event}}]}, null, (err, data) => {
      assert(err === null)
    })

    const actual = sendEmailStub.firstCall.args[1]
    assert(actual.includes(status))
  })

  it('should send one email per one user', async () => {
    const users = [{Username: '1', Attributes: [{}]}, {Username: '2', Attributes: [{}]}]
    listUsersStub.returns(users)

    const event = `{"message": "", "type": ${messageType.incidentCreated}}`
    const rawEvent = {Records: [{Sns: {Message: event}}]}
    await handle(rawEvent, null, (err, data) => {
      assert(err === null)
    })

    assert(sendEmailStub.callCount === users.length)
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
})
