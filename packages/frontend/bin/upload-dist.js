import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'

dotenv.config({path: `${__dirname}/../../../.env`})

const distDir = path.normalize(`${__dirname}/../dist`)
const files = fs.readdirSync(distDir, 'utf8')

import output from '../config/cloudformation-output.json'
const bucketName = output.S3BucketName

const uploadFile = (filename, filepath) => {
  const { REGION: region } = process.env
  const awsS3 = new AWS.S3({ region })
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Body: fs.readFileSync(filepath),
      Key: filename
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

Promise.all(files.map(async (filename) => {
  try {
    const filepath = path.join(distDir, filename)
    await uploadFile(filename, filepath)
  } catch (error) {
    console.error(error, error.stack)
    throw error
  }
})).catch((err) => {
  console.error('failed to upload files')
  console.error(err, err.stack)
})
