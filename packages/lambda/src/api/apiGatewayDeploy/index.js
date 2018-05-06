import APIGateway from 'aws/apiGateway'
import Response from 'aws/cfnResponse'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Create' || event.RequestType === 'Delete') {
    await Response.sendSuccess(event, context)
    return
  }
  const params = event.ResourceProperties
  console.log(`restApiId: ${params.RestApiId}`)
  console.log(`StageName: ${params.StageName}`)

  try {
    const apiGateway = new APIGateway()
    await apiGateway.deploy(params.RestApiId, params.StageName)
    await Response.sendSuccess(event, context)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}
