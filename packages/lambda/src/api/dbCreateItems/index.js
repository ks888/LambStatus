import response from 'cfn-response'
import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const {
    AdminPageURL: adminPageURL,
    StatusPageURL: statusPageURL
  } = event.ResourceProperties
  try {
    const settings = new Settings()
    if (adminPageURL) {
      await settings.setAdminPageURL(adminPageURL)
    }
    if (statusPageURL) {
      await settings.setStatusPageURL(statusPageURL)
    }
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
