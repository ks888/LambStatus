import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { SettingsProxy } from 'api/utils'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  const {clientID, username, code} = event
  const statusPageURL = await new SettingsProxy().getStatusPageURL()
  const script = `setTimeout(function(){ window.location.href = '${statusPageURL}'; }, 3*1000);`
  const message = 'confirmed!'
  try {
    await new Cognito().confirm(clientID, username, code)
    callback(null, {message, script})
    return
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }

  try {
    if (await isAlreadyConfirmed(username)) {
      callback(null, {message, script})
      return
    }
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }

  callback('Error: failed to confirm the code')
}

const isAlreadyConfirmed = async (username) => {
  try {
    const poolID = await new CloudFormation(stackName).getSubscribersPoolID()
    const user = await new Cognito().getUser(poolID, username)
    return user.UserStatus === 'CONFIRMED'
  } catch (error) {
    return false
  }
}
