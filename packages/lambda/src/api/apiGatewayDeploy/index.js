import response from 'cfn-response'
import APIGateway from 'aws/apiGateway'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }
  const params = event.ResourceProperties
  console.log(`restApiId: ${params.RestApiId}`)
  console.log(`StageName: ${params.StageName}`)

  try {
    const apiGateway = new APIGateway()
    await apiGateway.deploy(params.RestApiId, params.StageName)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
