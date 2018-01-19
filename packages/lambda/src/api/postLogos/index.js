import CloudFormation from 'aws/cloudFormation'
import S3 from 'aws/s3'
import { SettingsProxy } from 'api/utils'
import { RetinaImage, NormalImage } from 'model/image'
import { stackName } from 'utils/const'
import generateID from 'utils/generateID'

export async function handle (event, context, callback) {
  const data = event.data
  const imageID = generateID()
  const { AWS_REGION: region } = process.env
  const bucketName = await new CloudFormation(stackName).getStatusPageBucketName()

  try {
    const imageClasses = [RetinaImage, NormalImage]
    for (let i = 0; i < imageClasses.length; i++) {
      const image = new imageClasses[i](data)
      const body = await image.toBuffer()

      const objectName = `${imageID}${image.suffixForImageName()}`
      await new S3().putObject(region, bucketName, objectName, body, image.mimeType)
    }

    await new SettingsProxy().setLogoID(imageID)

    callback(null, {id: imageID})
  } catch (err) {
    callback('Error: ' + err.message)
  }
}
