import { SettingsProxy } from 'api/utils'

export async function handle (event, context, callback) {
  try {
    await new SettingsProxy().deleteLogoID()
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to delete the logo')
  }
}
