import AWS from 'aws-sdk'
import mime from 'mime'

export const putObject = (region, bucketName, objectName, body) => {
  const awsS3 = new AWS.S3({ region })
  return new Promise((resolve, reject) => {
    const contentType = mime.lookup(objectName)
    const params = {
      Bucket: bucketName,
      Body: body,
      Key: objectName,
      ContentType: contentType
    }
    awsS3.putObject(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      console.log('success!')
      resolve()
    })
  })
}
