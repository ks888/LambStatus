import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  try {
    const settings = new Settings()
    const serviceName = await settings.getServiceName()
    const adminPageURL = await settings.getAdminPageURL()
    const statusPageURL = await settings.getStatusPageURL()
    const apiKeys = await settings.getApiKeys()
    callback(null, {serviceName, adminPageURL, statusPageURL, apiKeys})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get settings')
  }
}
