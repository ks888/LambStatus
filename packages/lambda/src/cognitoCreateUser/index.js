import response from 'cfn-response'
import { createUser } from 'utils/cognito'

export async function handler (event, context, callback) {
  if (event.RequestType === 'Delete') {
    // UserPool will be deleted too, so do nothing here.
    response.send(event, context, response.SUCCESS)
    return
  }

  if (event.RequestType === 'Update') {
    if (event.ResourceProperties.UserName !== event.OldResourceProperties.UserName ||
      event.ResourceProperties.Email !== event.OldResourceProperties.Email) {
      console.log('can\'t update parameters of user')
      response.send(event, context, response.FAILED)
    } else {
      response.send(event, context, response.SUCCESS)
    }
    return
  }

  const {
    Region: region,
    UserPoolID: userPoolId,
    UserName: userName,
    Email: email
  } = event.ResourceProperties

  try {
    await createUser(region, userPoolId, userName, email)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
