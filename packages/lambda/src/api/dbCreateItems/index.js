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
    // failed due to the unknown SNS topic.
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
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
