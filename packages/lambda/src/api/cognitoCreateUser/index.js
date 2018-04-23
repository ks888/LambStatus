import Response from 'aws/cfnResponse'
import Cognito from 'aws/cognito'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    await Response.sendSuccess(event, context)
    return
  }

  const {
    UserPoolID: userPoolId,
    UserName: userName,
    Email: email
  } = event.ResourceProperties

  try {
    await new Cognito().createUser(userPoolId, userName, email)
    await Response.sendSuccess(event, context)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}
