import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  const {
    serviceName,
    adminPageURL,
    statusPageURL
  } = event.body
  try {
    const settings = await new Settings()
    if (serviceName) {
      settings.setServiceName(serviceName)
    }
    if (adminPageURL) {
      settings.setAdminPageURL(adminPageURL)
    }
    if (statusPageURL) {
      settings.setStatusPageURL(statusPageURL)
    }
    callback(null, JSON.stringify({serviceName, adminPageURL, statusPageURL}))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to set settings')
  }
}
