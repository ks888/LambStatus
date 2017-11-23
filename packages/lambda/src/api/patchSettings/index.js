import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  const {
    serviceName
  } = event.body
  try {
    const settings = new SettingsProxy()
    if (serviceName !== undefined && serviceName !== await settings.getServiceName()) {
      await settings.setServiceName(serviceName)
    }
    callback(null, {serviceName})
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
