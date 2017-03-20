import response from 'cfn-response'
import Cognito from 'aws/cognito'

export async function handle (event, context, callback) {
  const {
    Region: region,
    PoolName: poolName,
    ServiceName: serviceName,
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
    if (poolName !== event.OldResourceProperties.poolName ||
      snsCallerArn !== event.OldResourceProperties.SnsCallerArn ||
      serviceName !== event.OldResourceProperties.ServiceName ||
      adminPageURL !== event.OldResourceProperties.AdminPageURL) {
      console.log('can\'t update parameters of user pool')
      response.send(event, context, response.FAILED)
    } else {
      const poolID = event.PhysicalResourceId
      response.send(event, context, response.SUCCESS, {UserPoolID: poolID})
    }
    return
  }

  try {
    const userPool = await new Cognito().createUserPool(region, poolName, serviceName, adminPageURL, snsCallerArn)
    const poolID = userPool.UserPool.Id
    response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
