import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  try {
    const settings = new Settings()
    const apiKey = await settings.lookupApiKey(event.params.apikeyid)
    await apiKey.delete()
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    switch (error.name) {
      case 'NotFoundError':
        callback('Error: an item not found')
        break
      default:
        callback('Error: failed to delete the api key')
    }
  }
}
