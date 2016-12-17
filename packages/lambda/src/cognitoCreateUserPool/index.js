import response from 'cfn-response'
import { createUserPool, deleteUserPool } from 'utils/cognito'

export async function handler (event, context, callback) {
  const {
    Region: region,
    PoolName: poolName,
    SnsCallerArn: snsCallerArn
  } = event.ResourceProperties
  console.log(`received request (region: ${region}, poolName: ${poolName}, snsCallerArn: ${snsCallerArn})`)

  if (event.RequestType === 'Delete') {
    try {
      const poolID = event.PhysicalResourceId
      await deleteUserPool(region, poolID)
      response.send(event, context, response.SUCCESS, {UserPoolID: poolID})
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
      response.send(event, context, response.FAILED, error.message)
    }
    return
  }

  if (event.RequestType === 'Update') {
    if (poolName !== event.OldResourceProperties.poolName ||
      snsCallerArn !== event.OldResourceProperties.snsCallerArn) {
      response.send(event, context, response.FAILED, 'can\'t update parameters of user pool')
    } else {
      const poolID = event.PhysicalResourceId
      response.send(event, context, response.SUCCESS, {UserPoolID: poolID})
    }
    return
  }

  try {
    const userPool = await createUserPool(region, poolName, snsCallerArn)
    const poolID = userPool.UserPool.Id
    response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED, error.message)
  }
}
