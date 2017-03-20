import response from 'cfn-response'
import Cognito from 'aws/cognito'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Delete') {
    // UserPool will be deleted too, so do nothing here.
    const clientID = event.PhysicalResourceId
    response.send(event, context, response.SUCCESS, {UserPoolClientID: clientID})
    return
  }

  if (event.RequestType === 'Update') {
    if (event.ResourceProperties.ClientName !== event.OldResourceProperties.ClientName) {
      console.log('can\'t update parameters of user pool client')
      response.send(event, context, response.FAILED)
    } else {
      const clientID = event.PhysicalResourceId
      response.send(event, context, response.SUCCESS, {UserPoolClientID: clientID})
    }
    return
  }

  const {
    Region: region,
    UserPoolID: userPoolID,
    ClientName: clientName
  } = event.ResourceProperties

  try {
    const userPoolClient = await new Cognito().createUserPoolClient(region, userPoolID, clientName)
    const clientID = userPoolClient.UserPoolClient.ClientId
    response.send(event, context, response.SUCCESS, {UserPoolClientID: clientID}, clientID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
