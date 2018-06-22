import S3 from 'aws/s3'
import Response from 'aws/cfnResponse'

export async function handle (event, context, callback) {
  if (event.RequestType === 'Delete') {
    // TODO: handle delete request
    await Response.sendSuccess(event, context)
    return
  }

  const params = event.ResourceProperties
  console.log(`received request`)
  console.log(`source bucket name: ${params.SourceBucket}`)
  console.log(`source key: ${params.SourceKey}`)
  console.log(`destination bucket name: ${params.DestinationBucket}`)

  const {
    SourceBucket,
    SourceKey,
    DestinationRegion: region,
    DestinationBucket
  } = params
  try {
    const s3 = new S3()
    const objects = await s3.listObjects(region, SourceBucket, SourceKey)
    await Promise.all(objects.map(async (obj) => {
      const destKey = obj.Key.replace(SourceKey + '/', '')
      await s3.copyObject(region, SourceBucket, obj.Key, DestinationBucket, destKey)
    }))
    await Response.sendSuccess(event, context)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    await Response.sendFailed(event, context)
  }
}
