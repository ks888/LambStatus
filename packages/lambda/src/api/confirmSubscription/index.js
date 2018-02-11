import CloudFormation from 'aws/cloudFormation'
import Cognito from 'aws/cognito'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  const {username, code} = event
  const cloudFormation = new CloudFormation(stackName)
  const clientID = await cloudFormation.getSubscribersPoolClientID()
  const statusPageURL = await cloudFormation.getStatusPageCloudFrontURL()
  const script = `setTimeout(function(){ window.location.href = '${statusPageURL}'; }, 3*1000);`
  try {
    await new Cognito().confirm(clientID, username, code)
    callback(null, {message: 'confirmed!', script})
    return
  } catch (error) {
    if (error.name === 'AliasExistsException') {
      callback(null, {message: 'confirmed!', script})
      return
    }

    console.log(error.message)
    console.log(error.stack)
  }

  const poolID = await cloudFormation.getSubscribersPoolID()
  try {
    if (await isAlreadyConfirmed(poolID, username)) {
      callback(null, {message: 'already confirmed.', script})
      return
    }
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }

  callback('Error: failed to confirm the code')
}

const isAlreadyConfirmed = async (poolID, username) => {
  try {
    const user = await new Cognito().getUser(poolID, username)
    return user.UserStatus === 'CONFIRMED'
  } catch (error) {
    return false
  }
}
