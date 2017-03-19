import response from 'cfn-response'
import S3 from 'aws/s3'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Delete') {
    // TODO: handle delete request
    response.send(event, context, response.SUCCESS)
    return
  }

  const params = event.ResourceProperties
  console.log(`received request (region: ${params.Region}, bucket name: ${params.Bucket}, key: ${params.Key})`)

  try {
    const s3 = new S3()
    await s3.putObject(params.Region, params.Bucket, params.Key, params.Body)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
