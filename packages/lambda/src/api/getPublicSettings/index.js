import CloudFormation from 'aws/cloudFormation'
import { SettingsProxy } from 'api/utils'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  try {
    const settings = new SettingsProxy()
    const cloudFormation = new CloudFormation(stackName)
    const [serviceName, logoID, backgroundColor, statusPageURL] = await Promise.all([
      settings.getServiceName(),
      settings.getLogoID(),
      settings.getBackgroundColor(),
      cloudFormation.getStatusPageCloudFrontURL()
    ])

    callback(null, {serviceName, logoID, backgroundColor, statusPageURL})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get status page settings')
  }
}
