import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  try {
    const settings = new Settings()
    const serviceName = await settings.getServiceName()
    const adminPageURL = await settings.getAdminPageURL()
    const statusPageURL = await settings.getStatusPageURL()
    callback(null, {serviceName, adminPageURL, statusPageURL})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get settings')
  }
}
