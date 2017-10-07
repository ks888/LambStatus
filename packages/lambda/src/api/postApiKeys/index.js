import APIGateway from 'aws/apiGateway'
import CloudFormation from 'aws/cloudFormation'
import { stackName } from 'utils/const'

export async function handle (event, context, callback) {
  try {
    const usagePlanID = await new CloudFormation(stackName).getUsagePlanID()
    const apiKey = await new APIGateway().createApiKeyWithUsagePlan(stackName, usagePlanID)
    callback(null, apiKey.objectify())
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    callback('Error: failed to create a new api key')
  }
}
