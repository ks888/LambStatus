import Response from 'aws/cfnResponse'
import S3 from 'aws/s3'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Delete') {
    // TODO: handle delete request
    await Response.sendSuccess(event, context)
    return
  }

  const params = event.ResourceProperties
  const {Region: region, Bucket: bucket, Key: key, Body: body, CacheControl: cacheControl} = params
  console.log(`received request (region: ${region}, bucket name: ${bucket}, key: ${key})`)

  try {
    const s3 = new S3()
    await s3.putObject(region, bucket, key, body, undefined, cacheControl)
    await Response.sendSuccess(event, context)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}
