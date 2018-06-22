import Cognito from 'aws/cognito'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export async function handle (rawEvent, context, callback) {
  try {
    for (let record of rawEvent.Records) {
      const sesMessage = JSON.parse(record.Sns.Message)
      await handleMessageFromSES(sesMessage)
    }
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    console.log(rawEvent)
    callback('Error: failed to handle bounces and complaints')
  }
}

const handleMessageFromSES = async (sesMessage) => {
  if (sesMessage.notificationType === 'Bounce') {
    const bounce = sesMessage.bounce
    if (bounce.bounceType !== 'Transient') {
      await deleteUsers(bounce.bouncedRecipients.map(r => r.emailAddress))
    } else {
      console.log('transient bounce type', bounce)
    }
  } else if (sesMessage.notificationType === 'Complaint') {
    const complaint = sesMessage.complaint
    await deleteUsers(complaint.complainedRecipients.map(r => r.emailAddress))
  }
}

const deleteUsers = async (emailAddresses) => {
  const cloudFormation = new CloudFormation(stackName)
  const poolID = await cloudFormation.getSubscribersPoolID()

  const users = await Promise.all(emailAddresses.map(async email => {
    return await new Cognito().getUserByEmailAddress(poolID, email)
  }))

  await Promise.all(users.map(async user => {
    await new Cognito().deleteUser(poolID, user.Username)
  }))

  console.log('deleted:', emailAddresses)
}
