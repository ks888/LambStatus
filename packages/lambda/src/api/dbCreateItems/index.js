import response from 'cfn-response'
import { SettingsProxy } from 'api/utils'
import APIGateway from 'aws/apiGateway'
import SNS from 'aws/sns'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const {
    CognitoPoolID: cognitoPoolID,
    IncidentNotificationTopic: incidentNotificationTopic,
    UsagePlanID: usagePlanID
  } = event.ResourceProperties

  const settings = new SettingsProxy()
  try {
    await new SNS().notifyIncidentToTopic(incidentNotificationTopic)

    if (cognitoPoolID) {
      await settings.setCognitoPoolID(cognitoPoolID)
    }

    await new APIGateway().createApiKeyWithUsagePlan(stackName, usagePlanID)

    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
