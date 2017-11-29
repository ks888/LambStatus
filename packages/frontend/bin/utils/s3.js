import fs from 'fs'
import path from 'path'
import AWS from 'aws-sdk'
import mime from 'mime'
import { getCacheControl } from '../../../lambda/src/utils/cache'

export const uploadFile = (filepath, region, bucketName, objectName) => {
  const awsS3 = new AWS.S3({ region })
  return new Promise((resolve, reject) => {
    const contentType = mime.lookup(objectName)
    const cacheControl = getCacheControl(contentType)
    const params = {
      Bucket: bucketName,
      Body: fs.readFileSync(filepath),
      Key: objectName,
      ContentType: contentType,
      CacheControl: cacheControl
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

export const uploadDirectory = async (dir, region, bucketName, objectNamePrefix = '') => {
  const files = fs.readdirSync(dir, 'utf8')
  await Promise.all(files.map(async (filename) => {
    const filepath = path.join(dir, filename)
    const objectName = objectNamePrefix + filename
    await uploadFile(filepath, region, bucketName, objectName)
  })).catch((err) => {
    console.error('failed to upload files')
    console.error(err, err.stack)
  })
}

// can't list more than 1000 keys
export const listObjects = (region, bucketName, path) => {
  const awsS3 = new AWS.S3({ region })
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Prefix: path
    }
    awsS3.listObjectsV2(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result.Contents)
    })
  })
}

// can't delete more than 1000 keys
export const deleteObjects = (region, bucketName, objectKeys) => {
  const awsS3 = new AWS.S3({ region })
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: []
      }
    }
    objectKeys.forEach((objectKey) => {
      params.Delete.Objects.push({ Key: objectKey.Key
      })
    })
    awsS3.deleteObjects(params, (err, result) => {
      if (err) {
        return reject(err)
      }
      result.Deleted.forEach((obj) => {
        console.log('deleted: ' + obj.Key)
      })
      return resolve()
    })
  })
}
