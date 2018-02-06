import response from 'cfn-response'
import APIGateway from 'aws/apiGateway'
import SNS, {messageType} from 'aws/sns'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const {
    IncidentNotificationTopic: incidentNotificationTopic,
    UsagePlanID: usagePlanID
  } = event.ResourceProperties

  try {
    await new SNS().notifyIncidentToTopic(incidentNotificationTopic, '', messageType.metadataChanged)
    await new APIGateway().createApiKeyWithUsagePlan(stackName, usagePlanID)

    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
