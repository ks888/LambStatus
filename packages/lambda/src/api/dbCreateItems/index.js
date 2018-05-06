import Response from 'aws/cfnResponse'
import APIGateway from 'aws/apiGateway'
import SNS, {messageType} from 'aws/sns'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Update' || event.RequestType === 'Delete') {
    await Response.sendSuccess(event, context)
    return
  }

  const {
    IncidentNotificationTopic: incidentNotificationTopic,
    UsagePlanID: usagePlanID
  } = event.ResourceProperties

  try {
    await new SNS().notifyEventToTopic(incidentNotificationTopic, '', messageType.metadataChanged)
    await new APIGateway().createApiKeyWithUsagePlan(stackName, usagePlanID)

    await Response.sendSuccess(event, context)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}
