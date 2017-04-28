import response from 'cfn-response'
import Cognito from 'aws/cognito'
import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  const {
    Region: region,
    PoolName: poolName,
    AdminPageURL: adminPageURL,
    SnsCallerArn: snsCallerArn
  } = event.ResourceProperties

  if (event.RequestType === 'Delete') {
    try {
      const poolID = event.PhysicalResourceId
      await new Cognito().deleteUserPool(region, poolID)
      response.send(event, context, response.SUCCESS, {UserPoolID: poolID})
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      response.send(event, context, response.FAILED)
    }
    return
  }

  if (event.RequestType === 'Update') {
    const oldProps = event.OldResourceProperties
    if (poolName !== oldProps.PoolName || snsCallerArn !== oldProps.SnsCallerArn ||
      adminPageURL !== oldProps.AdminPageURL) {
      console.log(`can't update parameters of user pool`)
      response.send(event, context, response.FAILED)
    } else {
      const poolID = event.PhysicalResourceId
      response.send(event, context, response.SUCCESS, {UserPoolID: poolID})
    }
    return
  }

  try {
    const settings = new Settings()
    const serviceName = await settings.getServiceName()

    const userPool = await new Cognito().createUserPool(region, poolName, serviceName, adminPageURL, snsCallerArn)
    const poolID = userPool.UserPool.Id
    response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
