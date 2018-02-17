import { SettingsProxy } from 'api/utils'
import CloudFormation from 'aws/cloudFormation'
import APIGateway from 'aws/apiGateway'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  try {
    const settings = new SettingsProxy()
    const apiGateway = new APIGateway()
    const cloudFormation = new CloudFormation(stackName)
    const [serviceName, logoID, backgroundColor, emailNotification, adminPageURL, apiKeys] = await Promise.all([
      settings.getServiceName(),
      settings.getLogoID(),
      settings.getBackgroundColor(),
      settings.getEmailNotification(),
      cloudFormation.getAdminPageCloudFrontURL(),
      apiGateway.queryEnabledApiKey(stackName)
    ])
    const statusPageURL = await cloudFormation.getStatusPageCloudFrontURL()  // expect the cache is used

    callback(null, {serviceName, logoID, backgroundColor, emailNotification, adminPageURL, statusPageURL, apiKeys})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get settings')
  }
}
