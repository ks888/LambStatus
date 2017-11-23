import response from 'cfn-response'
import Cognito, { UserPool } from 'aws/cognito'
import { SettingsProxy } from 'api/utils'

const createUserPool = async (event, context, poolID) => {
  const {
    PoolName: poolName,
    AdminPageURL: adminPageURL,
    SnsCallerArn: snsCallerArn
  } = event.ResourceProperties

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

const updateUserPool = async (event, context) => {
  const {
    AdminPageURL: adminPageURL
  } = event.ResourceProperties
  const poolID = event.PhysicalResourceId

  const cognito = new Cognito()
  const userPool = await cognito.getUserPool(poolID)
  const settings = new SettingsProxy()
  userPool.serviceName = await settings.getServiceName()
  userPool.adminPageURL = adminPageURL
  await cognito.updateUserPool(userPool)

  // Note: If `physicalResourceId` is changed, the custom resource will be deleted.
  response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
}

const deleteUserPool = async (event, context) => {
  const poolID = event.PhysicalResourceId

  try {
    await new Cognito().deleteUserPool(poolID)
    response.send(event, context, response.SUCCESS, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}

export async function handle (event, context, callback) {
  switch (event.RequestType) {
    case 'Create':
      await createUserPool(event, context)
      break
    case 'Update':
      await updateUserPool(event, context)
      break
    case 'Delete':
      await deleteUserPool(event, context)
      break
    default:
      console.log('unknown request type:', event.RequestType)
      response.send(event, context, response.FAILED)
  }
}
