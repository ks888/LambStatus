import response from 'cfn-response'
import { listObjects, copyObject } from 'utils/s3'

export async function handler (event, context, callback) {
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS)
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
    const objects = await listObjects(region, SourceBucket, SourceKey)
    await Promise.all(objects.map(async (obj) => {
      const destKey = obj.Key.replace(SourceKey + '/', '')
      await copyObject(region, SourceBucket, obj.Key, DestinationBucket, destKey)
    }))
    response.send(event, context, response.SUCCESS)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
    response.send(event, context, response.FAILED, error.message)
  }
}
