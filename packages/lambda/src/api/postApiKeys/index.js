import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  try {
    const settings = new Settings()
    const apiKey = await settings.createApiKey()
    callback(null, apiKey.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to create a new api key')
  }
}
