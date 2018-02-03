import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { SettingsProxy } from 'api/utils'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  const {username, token} = event

  const message = 'unsubscribed.'
  let script
  try {
    const statusPageURL = await new SettingsProxy().getStatusPageURL()
    script = `setTimeout(function(){ window.location.href = '${statusPageURL}'; }, 3*1000);`
    const poolID = await new CloudFormation(stackName).getSubscribersPoolID()

    if (!await isValidUser(poolID, username, token)) {
      throw new Error('invalid user token')
    }

    await new Cognito().deleteUser(poolID, username)

    callback(null, {message, script})
  } catch (error) {
    if (error.name === 'UserNotFoundException') {
      callback(null, {message, script})
      return
    }

    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to unsubscribe the status updates')
  }
}

const isValidUser = async (poolID, username, token) => {
  const user = await new Cognito().getUser(poolID, username)
  for (let attr of user.UserAttributes) {
    if (attr.Name === 'custom:token') {
      return attr.Value === token
    }
  }

  return false
}
