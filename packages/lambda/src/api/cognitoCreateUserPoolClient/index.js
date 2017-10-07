import response from 'cfn-response'
import Cognito from 'aws/cognito'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    // UserPool will be deleted too, so do nothing here.
    const clientID = event.PhysicalResourceId
    response.send(event, context, response.SUCCESS, {UserPoolClientID: clientID}, clientID)
    return
  }

  const {
    UserPoolID: userPoolID,
    ClientName: clientName
  } = event.ResourceProperties

  try {
    const userPoolClient = await new Cognito().createUserPoolClient(userPoolID, clientName)
    const clientID = userPoolClient.ClientId
    response.send(event, context, response.SUCCESS, {UserPoolClientID: clientID}, clientID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
