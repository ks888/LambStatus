import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  const {
    serviceName,
    backgroundColor,
    emailNotification
  } = event.body
  try {
    const settings = new SettingsProxy()
    if (serviceName !== undefined) {
      await settings.setServiceName(serviceName)
    }
    if (backgroundColor !== undefined) {
      await settings.setBackgroundColor(backgroundColor)
    }
    if (emailNotification !== undefined) {
      await settings.setEmailNotification(emailNotification)
    }

    callback(null, {serviceName, backgroundColor, emailNotification})
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
