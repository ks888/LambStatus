import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    const settings = new SettingsProxy()
    const [serviceName, logoID, backgroundColor, statusPageURL] = await Promise.all([
      settings.getServiceName(),
      settings.getLogoID(),
      settings.getBackgroundColor(),
      settings.getStatusPageURL()
    ])

    callback(null, {serviceName, logoID, backgroundColor, statusPageURL})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get status page settings')
  }
}
