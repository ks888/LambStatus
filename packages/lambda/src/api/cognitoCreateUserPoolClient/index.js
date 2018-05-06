import Response from 'aws/cfnResponse'
import Cognito from 'aws/cognito'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    // UserPool will be deleted too, so do nothing here.
    const clientID = event.PhysicalResourceId
    await Response.sendSuccess(event, context, {UserPoolClientID: clientID}, clientID)
    return
  }

  const {
    UserPoolID: userPoolID,
    ClientName: clientName
  } = event.ResourceProperties

  try {
    const userPoolClient = await new Cognito().createUserPoolClient(userPoolID, clientName)
    const clientID = userPoolClient.ClientId
    await Response.sendSuccess(event, context, {UserPoolClientID: clientID}, clientID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}
