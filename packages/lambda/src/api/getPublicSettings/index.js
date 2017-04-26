import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  try {
    const settings = await new Settings()
    const serviceName = settings.getServiceName()
    const statusPageURL = settings.getStatusPageURL()
    callback(null, JSON.stringify({serviceName, statusPageURL}))
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to get status page settings')
  }
}
