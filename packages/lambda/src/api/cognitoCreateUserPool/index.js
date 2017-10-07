import response from 'cfn-response'
import Cognito, { UserPool } from 'aws/cognito'
import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  const {
    PoolName: poolName,
    AdminPageURL: adminPageURL,
    SnsCallerArn: snsCallerArn
  } = event.ResourceProperties

  if (event.RequestType === 'Delete') {
    try {
      const poolID = event.PhysicalResourceId
      await new Cognito().deleteUserPool(poolID)
      response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      response.send(event, context, response.FAILED)
    }
    return
  }

  if (event.RequestType === 'Update') {
    const poolID = event.PhysicalResourceId
    // If `physicalResourceId` is changed, the custom resource will be deleted.
    response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
    return
  }

  try {
    const settings = new SettingsProxy()
    const serviceName = await settings.getServiceName()

    const userPool = new UserPool({userPoolName: poolName, serviceName, adminPageURL, snsCallerArn})
    const createdUserPool = await new Cognito().createUserPool(userPool)
    const poolID = createdUserPool.userPoolID
    response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
