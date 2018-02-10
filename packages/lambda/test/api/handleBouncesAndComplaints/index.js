import assert from 'assert'
import sinon from 'sinon'
import { handle } from 'api/handleBouncesAndComplaints'
import Cognito from 'aws/cognito'
import CloudFormation from 'aws/cloudFormation'

describe('handleBouncesAndComplaints', () => {
  let deleteUserStub

  beforeEach(() => {
    deleteUserStub = sinon.stub(Cognito.prototype, 'deleteUser')
    sinon.stub(Cognito.prototype, 'getUserByEmailAddress').returns({})
    sinon.stub(CloudFormation.prototype, 'getSubscribersPoolID')
  })

  afterEach(() => {
    Cognito.prototype.deleteUser.restore()
    Cognito.prototype.getUserByEmailAddress.restore()
    CloudFormation.prototype.getSubscribersPoolID.restore()
  })

  it('should delete users associated with bounced email addresses', async () => {
    const bounceEmails = ['test1@example.com', 'test2@example.com']
    const bounceMessage = {bouncedRecipients: bounceEmails.map(email => { return {emailAddress: email} })}
    const event = JSON.stringify({notificationType: 'Bounce', bounce: bounceMessage})
    await handle({Records: [{Sns: {Message: event}}]}, null, (err, data) => {
      assert(err === null)
    })

    assert(deleteUserStub.callCount === bounceEmails.length)
  })

  it('should not delete a user if soft bounce', async () => {
    const bounceEmails = ['test1@example.com', 'test2@example.com']
    const bounceMessage = {
      bouncedRecipients: bounceEmails.map(email => { return {emailAddress: email} }),
      bounceType: 'Transient'
    }
    const event = JSON.stringify({notificationType: 'Bounce', bounce: bounceMessage})
    await handle({Records: [{Sns: {Message: event}}]}, null, (err, data) => {
      assert(err === null)
    })

    assert(deleteUserStub.notCalled)
  })

  it('should do nothing if the notification type is unknown', async () => {
    const event = `{"notificationType": "Delivery"}`
    await handle({Records: [{Sns: {Message: event}}]}, null, (err, data) => {
      assert(err === null)
    })
  })

  it('should delete users associated with complaint email addresses', async () => {
    const complaintEmails = ['test1@example.com', 'test2@example.com']
    const complaintMessage = {complainedRecipients: complaintEmails.map(email => { return {emailAddress: email} })}
    const event = JSON.stringify({notificationType: 'Complaint', complaint: complaintMessage})
    await handle({Records: [{Sns: {Message: event}}]}, null, (err, data) => {
      assert(err === null)
    })

    assert(deleteUserStub.callCount === complaintEmails.length)
  })
})
