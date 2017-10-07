import { SettingsProxy } from 'api/utils'
import APIGateway from 'aws/apiGateway'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  try {
    const settings = new SettingsProxy()
    const serviceName = await settings.getServiceName()
    const adminPageURL = await settings.getAdminPageURL()
    const statusPageURL = await settings.getStatusPageURL()

    const apiKeys = await new APIGateway().queryEnabledApiKey(stackName)
    callback(null, {serviceName, adminPageURL, statusPageURL, apiKeys})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get settings')
  }
}
