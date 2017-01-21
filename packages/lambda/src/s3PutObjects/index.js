import response from 'cfn-response'
import { putObject } from 'utils/s3'

export async function handler (event, context, callback) {
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
    return
  }

  const params = event.ResourceProperties
  console.log(`received request (region: ${params.Region}, bucket name: ${params.Bucket}, key: ${params.Key})`)

  try {
    await putObject(params.Region, params.Bucket, params.Key, params.Body)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
