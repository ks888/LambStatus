import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  const {
    serviceName,
    adminPageURL,
    statusPageURL
  } = event.body
  try {
    const settings = new Settings()
    if (serviceName !== undefined && serviceName !== await settings.getServiceName()) {
      await settings.setServiceName(serviceName)
    }
    if (adminPageURL !== undefined && adminPageURL !== await settings.getAdminPageURL()) {
      await settings.setAdminPageURL(adminPageURL)
    }
    if (statusPageURL !== undefined && statusPageURL !== await settings.getStatusPageURL()) {
      await settings.setStatusPageURL(statusPageURL)
    }
    const apiKeys = await settings.allApiKeys()
    callback(null, {serviceName, adminPageURL, statusPageURL, apiKeys})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'ValidationError':
        callback('Error: ' + error.message)
        break
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to set settings')
    }
  }
}
