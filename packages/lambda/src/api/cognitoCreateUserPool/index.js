import Response from 'aws/cfnResponse'
import { AdminUserPool } from 'aws/cognito'
import { SettingsProxy } from 'api/utils'

const createUserPool = async (event, context, poolID) => {
  const {
    PoolName: userPoolName,
    AdminPageURL: adminPageURL,
    SnsCallerArn: snsCallerArn
  } = event.ResourceProperties

  try {
    const settings = new SettingsProxy()
    const serviceName = await settings.getServiceName()

    const adminUserPool = new AdminUserPool({userPoolName, serviceName, adminPageURL, snsCallerArn})
    const poolID = await adminUserPool.create()

    await Response.sendSuccess(event, context, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}

const updateUserPool = async (event, context) => {
  const {
    AdminPageURL: adminPageURL
  } = event.ResourceProperties
  const poolID = event.PhysicalResourceId

  try {
    const serviceName = await new SettingsProxy().getServiceName()

    const adminUserPool = await AdminUserPool.get(poolID, {adminPageURL, serviceName})
    await adminUserPool.update()

    // Note: If `physicalResourceId` is changed, the custom resource will be deleted.
    await Response.sendSuccess(event, context, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}

const deleteUserPool = async (event, context) => {
  const poolID = event.PhysicalResourceId

  try {
    const adminUserPool = await AdminUserPool.get(poolID)
    await adminUserPool.delete()

    await Response.sendSuccess(event, context, {UserPoolID: poolID}, poolID)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
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
      await Response.sendFailed(event, context)
  }
}
