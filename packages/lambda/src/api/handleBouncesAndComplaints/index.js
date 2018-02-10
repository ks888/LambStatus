import Cognito from 'aws/cognito'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export async function handle (rawEvent, context, callback) {
  try {
    const sesMessage = JSON.parse(rawEvent.Records[0].Sns.Message)
    if (sesMessage.notificationType === 'Bounce') {
      const bounce = sesMessage.bounce
      if (bounce.bounceType !== 'Transient') {
        await deleteUsers(bounce.bouncedRecipients.map(r => r.emailAddress))
      } else {
        console.log('unsupported bounce type', bounce)
      }
    } else if (sesMessage.notificationType === 'Complaint') {
      const complaint = sesMessage.complaint
      await deleteUsers(complaint.complainedRecipients.map(r => r.emailAddress))
    }
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to handle bounces and complaints')
  }
}

const deleteUsers = async (emailAddresses) => {
  const cloudFormation = new CloudFormation(stackName)
  const poolID = await cloudFormation.getSubscribersPoolID()

  const users = await Promise.all(emailAddresses.map(async email => {
    return await new Cognito().getUserByEmailAddress(poolID, email)
  }))

  await Promise.all(users.map(async user => {
    return await new Cognito().deleteUser(poolID, user.username)
  }))
}
