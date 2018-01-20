import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  const {
    serviceName,
    backgroundColor
  } = event.body
  try {
    const settings = new SettingsProxy()
    if (serviceName !== undefined) {
      await settings.setServiceName(serviceName)
    }
    if (backgroundColor !== undefined) {
      await settings.setBackgroundColor(backgroundColor)
    }

    callback(null, {serviceName, backgroundColor})
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
