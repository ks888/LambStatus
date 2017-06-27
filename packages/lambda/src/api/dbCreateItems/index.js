import response from 'cfn-response'
import SNS from 'aws/sns'
import { Settings } from 'model/settings'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const {
    AdminPageURL: adminPageURL,
    StatusPageURL: statusPageURL,
    CognitoPoolID: cognitoPoolID,
    IncidentNotificationTopic: incidentNotificationTopic
  } = event.ResourceProperties

  const settings = new Settings()
  try {
    if (statusPageURL) {
      await settings.setStatusPageURL(statusPageURL)
    }
  } catch (error) {
    // setStatusPageURL always fails due to the unknown SNS topic. So ignore the error here.
    // TODO: improve error handling. There may be other kinds of errors.
    console.warn(error.message)
  }

  try {
    await new SNS().notifyIncidentToTopic(incidentNotificationTopic)

    if (adminPageURL) {
      await settings.setAdminPageURL(adminPageURL)
    }
    if (cognitoPoolID) {
      await settings.setCognitoPoolID(cognitoPoolID)
    }

    await settings.createApiKey()

    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
