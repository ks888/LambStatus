import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    const settings = new SettingsProxy()
    const [serviceName, logoID, statusPageURL] = await Promise.all([
      settings.getServiceName(),
      settings.getLogoID(),
      settings.getStatusPageURL()
    ])

    callback(null, {serviceName, logoID, statusPageURL})
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get status page settings')
  }
}
