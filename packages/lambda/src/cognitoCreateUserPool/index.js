import response from 'cfn-response'
import { createUserPool } from 'utils/cognito'

export async function handler (event, context, callback) {
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  if (event.RequestType === 'Update') {
    if (event.ResourceProperties.poolName !== event.OldResourceProperties.poolName ||
      event.ResourceProperties.snsCallerArn !== event.OldResourceProperties.snsCallerArn) {
      response.send(event, context, response.FAILED, 'can\'t update parameters of user pool')
    } else {
      response.send(event, context, response.SUCCESS)
    }
    return
  }

  const {
    Region: region,
    PoolName: poolName,
    SnsCallerArn: snsCallerArn
  } = event.ResourceProperties
  console.log(`received request (region: ${region}, poolName: ${poolName}, snsCallerArn: ${snsCallerArn})`)

  try {
    const userPool = await createUserPool(region, poolName, snsCallerArn)
    response.send(event, context, response.SUCCESS, {UserPoolID: userPool.UserPool.Id})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED, error.message)
  }
}
