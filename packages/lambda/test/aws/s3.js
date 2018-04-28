import assert from 'assert'
import AWS from 'aws-sdk-mock'
import S3 from 'aws/s3'

describe('S3', () => {
  afterEach(() => {
    AWS.restore('S3')
  })

  describe('getObject', () => {
    it('should get object', async () => {
      const bucketName = 'test'
      const objectName = 'test'
      let actual
      AWS.mock('S3', 'getObject', (params, callback) => {
        actual = params
        callback(null)
      })

      const s3 = new S3()
      await s3.getObject(undefined, bucketName, objectName)

      assert(actual.Bucket === bucketName)
      assert(actual.Key === objectName)
    })

    it('should throw error if getObject fails ', async () => {
      AWS.mock('S3', 'getObject', (params, callback) => {
        callback('error')
      })

      let err
      try {
        await new S3().getObject()
      } catch (e) {
        err = e
      }

      assert(err !== undefined)
    })
  })

  describe('putObject', () => {
    it('should put object', async () => {
      const bucketName = 'test'
      const objectName = 'test.html'
      const body = 'data'
      const contentType = 'text/html'
      const cacheControl = 'max-age=10'
      const acl = 'public-read'
      let actual
      AWS.mock('S3', 'putObject', (params, callback) => {
        actual = params
        callback(null)
      })

      const s3 = new S3()
      await s3.putObject(undefined, bucketName, objectName, body, undefined, undefined, acl)

      assert(actual.Bucket === bucketName)
      assert(actual.Key === objectName)
      assert(actual.Body === body)
      assert(actual.ContentType === contentType)
      assert(actual.CacheControl === cacheControl)
      assert(actual.ACL === acl)
    })

    it('should throw error if putObject fails ', async () => {
      AWS.mock('S3', 'putObject', (params, callback) => {
        callback('error')
      })

      let err
      try {
        await new S3().putObject()
      } catch (e) {
        err = e
      }

      assert(err !== undefined)
    })
  })

  describe('listObjects', () => {
    it('should list objects', async () => {
      const bucketName = 'test'
      const path = 'test'
      let actual
      AWS.mock('S3', 'listObjectsV2', (params, callback) => {
        actual = params
        callback(null, {Contents: []})
      })

      const s3 = new S3()
      await s3.listObjects(undefined, bucketName, path)

      assert(actual.Bucket === bucketName)
      assert(actual.Prefix === path)
    })

    it('should throw error if listObjects fails ', async () => {
      AWS.mock('S3', 'listObjectsV2', (params, callback) => {
        callback('error')
      })

      let err
      try {
        await new S3().listObjects()
      } catch (e) {
        err = e
      }

      assert(err !== undefined)
    })
  })

  describe('copyObject', () => {
    it('should copy object', async () => {
      const srcBucketName = 'test'
      const srcObjectName = 'test'
      const destBucketName = 'test'
      const destObjectName = 'test.html'
      const contentType = 'text/html'
      const cacheControl = 'max-age=10'
      const acl = 'public-read'
      let actual
      AWS.mock('S3', 'copyObject', (params, callback) => {
        actual = params
        callback(null)
      })

      const s3 = new S3()
      await s3.copyObject(undefined, srcBucketName, srcObjectName, destBucketName, destObjectName, acl)

      assert(actual.Bucket === destBucketName)
      assert(actual.Key === destObjectName)
      assert(actual.CopySource === srcBucketName + '/' + srcObjectName)
      assert(actual.ContentType === contentType)
      assert(actual.CacheControl === cacheControl)
      assert(actual.ACL === acl)
    })

    it('should throw error if copyObject fails ', async () => {
      AWS.mock('S3', 'copyObject', (params, callback) => {
        callback('error')
      })

      let err
      try {
        await new S3().copyObject()
      } catch (e) {
        err = e
      }

      assert(err !== undefined)
    })
  })
})

