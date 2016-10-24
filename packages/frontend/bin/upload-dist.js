import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'
import mime from 'mime'
import output from '../config/cloudformation-output.json'

dotenv.config({path: `${__dirname}/../../../.env`})

const uploadFile = (filepath, bucketName, objectName) => {
  const { REGION: region } = process.env
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

const uploadDirectory = (dir, bucketName) => {
  const files = fs.readdirSync(dir, 'utf8')
  Promise.all(files.map(async (filename) => {
    try {
      const filepath = path.join(dir, filename)
      await uploadFile(filepath, bucketName, filename)
    } catch (error) {
      console.error(error, error.stack)
      throw error
    }
  })).catch((err) => {
    console.error('failed to upload files')
    console.error(err, err.stack)
  })
}

const adminPageDir = path.normalize(`${__dirname}/../dist/admin-page`)
const adminPageBucketName = output.AdminPageS3BucketName
uploadDirectory(adminPageDir, adminPageBucketName)

const statusPageDir = path.normalize(`${__dirname}/../dist/status-page`)
const statusPageBucketName = output.StatusPageS3BucketName
uploadDirectory(statusPageDir, statusPageBucketName)
