import fs from 'fs'
import path from 'path'
import AWS from 'aws-sdk'
import mime from 'mime'

export const uploadFile = (filepath, region, bucketName, objectName) => {
  const awsS3 = new AWS.S3({ region })
  return new Promise((resolve, reject) => {
    const contentType = mime.lookup(objectName)
    const params = {
      Bucket: bucketName,
      Body: fs.readFileSync(filepath),
      Key: objectName,
      ContentType: contentType
    }
    awsS3.putObject(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      console.log('uploaded: ' + filepath)
      resolve()
    })
  })
}

export const uploadDirectory = (dir, region, bucketName) => {
  const files = fs.readdirSync(dir, 'utf8')
  Promise.all(files.map(async (filename) => {
    try {
      const filepath = path.join(dir, filename)
      await uploadFile(filepath, region, bucketName, filename)
    } catch (error) {
      console.error(error, error.stack)
      throw error
    }
  })).catch((err) => {
    console.error('failed to upload files')
    console.error(err, err.stack)
  })
}
