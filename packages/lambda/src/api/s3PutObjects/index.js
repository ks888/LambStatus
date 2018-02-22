import response from 'cfn-response'
import S3 from 'aws/s3'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Delete') {
    // TODO: handle delete request
    response.send(event, context, response.SUCCESS)
    return
  }

  const params = event.ResourceProperties
  const {Region: region, Bucket: bucket, Key: key, Body: body, CacheControl: cacheControl} = params
  console.log(`received request (region: ${region}, bucket name: ${bucket}, key: ${key})`)

  try {
    const s3 = new S3()
    await s3.putObject(region, bucket, key, body, undefined, cacheControl)
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED)
  }
}
