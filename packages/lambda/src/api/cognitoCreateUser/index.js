import response from 'cfn-response'
import Cognito from 'aws/cognito'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const {
    Region: region,
    UserPoolID: userPoolId,
    UserName: userName,
    Email: email
  } = event.ResourceProperties

  try {
    await new Cognito().createUser(region, userPoolId, userName, email)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
