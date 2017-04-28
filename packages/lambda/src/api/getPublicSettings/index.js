import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  try {
    const settings = new Settings()
    const serviceName = await settings.getServiceName()
    const statusPageURL = await settings.getStatusPageURL()
    callback(null, JSON.stringify({serviceName, statusPageURL}))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get status page settings')
  }
}
