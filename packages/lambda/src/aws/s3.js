import AWS from 'aws-sdk'
import mime from 'mime'
import { getCacheControl } from 'utils/cache'

export default class S3 {
  getObject (region, bucketName, objectName) {
    const awsS3 = new AWS.S3({ region })
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        Key: objectName
      }
      awsS3.getObject(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  }

  putObject (region, bucketName, objectName, body) {
    const awsS3 = new AWS.S3({ region })
    return new Promise((resolve, reject) => {
      const contentType = mime.lookup(objectName)
      const cacheControl = getCacheControl(contentType)
      const params = {
        Bucket: bucketName,
        Body: body,
        Key: objectName,
        ContentType: contentType,
        CacheControl: cacheControl
      }
      awsS3.putObject(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  }

  // can't list more than 1000 keys
  listObjects (region, bucketName, path) {
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

  copyObject (region, srcBucketName, srcObjectName, destBucketName, destObjectName) {
    const awsS3 = new AWS.S3({ region })
    return new Promise((resolve, reject) => {
      const contentType = mime.lookup(destObjectName)
      const cacheControl = getCacheControl(contentType)
      const params = {
        Bucket: destBucketName,
        Key: destObjectName,
        ContentType: contentType,
        CacheControl: cacheControl,
        CopySource: srcBucketName + '/' + srcObjectName,
        MetadataDirective: 'REPLACE'
      }
      awsS3.copyObject(params, (err, result) => {
        if (err) {
          return reject(err)
        }
        console.log('copied: ' + destObjectName)
        resolve()
      })
    })
  }
}
