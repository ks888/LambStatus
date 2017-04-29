import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  const {
    serviceName,
    adminPageURL,
    statusPageURL
  } = event.body
  try {
    const settings = new Settings()
    if (serviceName !== undefined) {
      await settings.setServiceName(serviceName)
    }
    if (adminPageURL !== undefined) {
      await settings.setAdminPageURL(adminPageURL)
    }
    if (statusPageURL !== undefined) {
      await settings.setStatusPageURL(statusPageURL)
    }
    callback(null, JSON.stringify({serviceName, adminPageURL, statusPageURL}))
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
